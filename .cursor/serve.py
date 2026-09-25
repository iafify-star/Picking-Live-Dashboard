#!/usr/bin/env python3
"""Cross-platform launcher for the Noon Minutes picking dashboard.

The repository ships a Windows PowerShell HTTP server (server.ps1) that relies
on Windows-only pieces (Get-CimInstance Win32_Process, spawning powershell.exe,
and auto-launching a browser). This launcher provides the same HTTP contract on
Linux/macOS so the dashboard can run in the Cloud Agent environment:

  * serves the static site (index.html, app.js, styles.css, assets/*)
  * exposes /api/data (and /api/data?fresh=1) backed by cache/data.json
  * periodically runs the *real* refresh scripts (refresh-data.ps1 /
    refresh-names.ps1) via PowerShell Core (pwsh), exactly like server.ps1

The substantive data pipeline is unchanged; only the Windows-specific serving
glue is reimplemented here.
"""

import http.server
import mimetypes
import os
import shutil
import socketserver
import subprocess
import threading
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "cache"
DATA_FILE = CACHE / "data.json"
NAMES_FILE = CACHE / "names.json"
REFRESH_DATA = ROOT / "refresh-data.ps1"
REFRESH_NAMES = ROOT / "refresh-names.ps1"

PORT = int(os.environ.get("PORT", "5500"))
HOST = os.environ.get("HOST", "127.0.0.1")
DATA_REFRESH_SECONDS = 50
NAMES_REFRESH_SECONDS = 1800

mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("image/svg+xml", ".svg")

_refresh_lock = threading.Lock()
_last_data_kick = 0.0


def _pwsh() -> str | None:
    return shutil.which("pwsh") or shutil.which("powershell")


def _run_script(script: Path) -> None:
    """Run a refresh script via pwsh with a Linux-friendly TEMP set."""
    pwsh = _pwsh()
    if not pwsh or not script.exists():
        return
    env = dict(os.environ)
    env.setdefault("TEMP", "/tmp")
    env.setdefault("TMP", "/tmp")
    try:
        result = subprocess.run(
            [pwsh, "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(script)],
            cwd=str(ROOT),
            env=env,
            capture_output=True,
            text=True,
            timeout=300,
        )
        tag = script.name
        out = (result.stdout or "").strip()
        err = (result.stderr or "").strip()
        if out:
            print(f"[refresh] {tag}: {out}", flush=True)
        if err:
            print(f"[refresh] {tag} (stderr): {err}", flush=True)
    except Exception as exc:  # keep the server alive on refresh failures
        print(f"[refresh] {script.name} failed: {exc}", flush=True)


def _refresh_data(force: bool = False) -> None:
    global _last_data_kick
    now = time.time()
    if not force and (now - _last_data_kick) < DATA_REFRESH_SECONDS:
        return
    if not _refresh_lock.acquire(blocking=False):
        return
    try:
        _last_data_kick = time.time()
        _run_script(REFRESH_DATA)
    finally:
        _refresh_lock.release()


def _background_worker() -> None:
    """Mirror server.ps1: kick data on startup + on an interval, names as needed."""
    CACHE.mkdir(exist_ok=True)
    if not NAMES_FILE.exists():
        threading.Thread(target=_run_script, args=(REFRESH_NAMES,), daemon=True).start()
    _refresh_data(force=True)
    last_names = time.time()
    while True:
        time.sleep(DATA_REFRESH_SECONDS)
        threading.Thread(target=_refresh_data, kwargs={"force": True}, daemon=True).start()
        if time.time() - last_names >= NAMES_REFRESH_SECONDS:
            last_names = time.time()
            threading.Thread(target=_run_script, args=(REFRESH_NAMES,), daemon=True).start()


class Handler(http.server.BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        print("[http] " + (fmt % args), flush=True)

    def _send(self, status, content_type, body: bytes):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        query = self.path.split("?", 1)[1] if "?" in self.path else ""

        if path == "/api/data":
            if "fresh=1" in query:
                threading.Thread(target=_refresh_data, kwargs={"force": True}, daemon=True).start()
            if DATA_FILE.exists():
                self._send(200, "application/json; charset=utf-8", DATA_FILE.read_bytes())
            else:
                self._send(200, "application/json; charset=utf-8",
                           b'{"ok":false,"loading":true}')
            return

        if path == "/":
            path = "/index.html"
        safe = os.path.normpath(path).lstrip("/\\")
        target = (ROOT / safe).resolve()
        if not str(target).startswith(str(ROOT)):
            self._send(403, "text/plain; charset=utf-8", b"Forbidden")
            return
        if target.is_file():
            ctype = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
            self._send(200, ctype, target.read_bytes())
        else:
            self._send(404, "text/plain; charset=utf-8", b"Not found")


class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def main() -> None:
    if not _pwsh():
        print("[warn] pwsh not found; live data refresh is disabled. "
              "Install PowerShell Core to enable /api/data updates.", flush=True)
    threading.Thread(target=_background_worker, daemon=True).start()
    print("", flush=True)
    print("Noon Minutes Pick Dashboard", flush=True)
    print(f"Open: http://{HOST}:{PORT}/", flush=True)
    print("Ctrl+C to stop", flush=True)
    print("", flush=True)
    with ThreadingHTTPServer((HOST, PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
