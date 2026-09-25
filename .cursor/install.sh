#!/usr/bin/env bash
# Idempotent environment bootstrap for the Noon Minutes picking dashboard.
# Installs PowerShell Core (needed to run the real refresh-*.ps1 data scripts on
# Linux) and seeds the cache so the dashboard shows data on first load.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PWSH_VERSION="7.4.6"
PWSH_DEB="powershell_${PWSH_VERSION}-1.deb_amd64.deb"
PWSH_URL="https://github.com/PowerShell/PowerShell/releases/download/v${PWSH_VERSION}/${PWSH_DEB}"

if ! command -v pwsh >/dev/null 2>&1; then
  echo "[install] Installing PowerShell Core ${PWSH_VERSION}..."
  tmp_deb="$(mktemp --suffix=.deb)"
  curl -fsSL "$PWSH_URL" -o "$tmp_deb"
  sudo dpkg -i "$tmp_deb" || sudo apt-get install -f -y
  rm -f "$tmp_deb"
else
  echo "[install] PowerShell Core already present: $(pwsh --version)"
fi

echo "[install] Seeding data cache (non-fatal if the source is unreachable)..."
mkdir -p "$ROOT/cache"
export TEMP="${TEMP:-/tmp}"
export TMP="${TMP:-/tmp}"
pwsh -NoProfile -ExecutionPolicy Bypass -File "$ROOT/refresh-data.ps1" || \
  echo "[install] Initial data refresh failed; the server will retry at runtime."
pwsh -NoProfile -ExecutionPolicy Bypass -File "$ROOT/refresh-names.ps1" || \
  echo "[install] Initial names refresh failed; the server will retry at runtime."

echo "[install] Done."
