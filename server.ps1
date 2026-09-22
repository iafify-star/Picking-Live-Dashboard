$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Web
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 5500
$CacheFile = Join-Path $Root "cache\data.json"
$RefreshScript = Join-Path $Root "refresh-data.ps1"

function Get-MimeType([string]$Path) {
    switch ([IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        ".html" { "text/html; charset=utf-8" }
        ".css"  { "text/css; charset=utf-8" }
        ".js"   { "application/javascript; charset=utf-8" }
        ".svg"  { "image/svg+xml" }
        ".png"  { "image/png" }
        ".json" { "application/json; charset=utf-8" }
        default { "application/octet-stream" }
    }
}

function Send-Response($Response, [int]$Status, [string]$ContentType, [byte[]]$Bytes) {
    $Response.StatusCode = $Status
    $Response.ContentType = $ContentType
    $Response.Headers.Add("Cache-Control", "no-store")
    $Response.Headers.Add("Access-Control-Allow-Origin", "*")
    $Response.ContentLength64 = $Bytes.Length
    $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
    $Response.OutputStream.Close()
}

function Send-Text($Response, [int]$Status, [string]$ContentType, [string]$Text) {
    $bytes = [Text.Encoding]::UTF8.GetBytes($Text)
    Send-Response $Response $Status $ContentType $bytes
}

function Start-Refresh {
    $running = Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -and $_.CommandLine -like "*refresh-data.ps1*" }
    if ($running) { return }
    Start-Process -FilePath "powershell.exe" -WindowStyle Hidden -ArgumentList @(
        "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $RefreshScript
    )
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)
try {
    $listener.Start()
} catch {
    Write-Host "Port $Port is busy. Close the old window or change the port."
    throw
}

Write-Host ""
Write-Host "Noon Minutes Pick Dashboard"
Write-Host "Open: $prefix"
Write-Host "Ctrl+C to stop"
Write-Host ""

Start-Refresh
Start-Process $prefix
$lastKick = Get-Date

while ($listener.IsListening) {
    $ctx = $null
    try {
        $async = $listener.BeginGetContext($null, $null)
        while (-not $async.IsCompleted) {
            if (((Get-Date) - $lastKick).TotalSeconds -ge 50) {
                Start-Refresh
                $lastKick = Get-Date
            }
            Start-Sleep -Milliseconds 200
        }
        $ctx = $listener.EndGetContext($async)
        $req = $ctx.Request
        $res = $ctx.Response
        $path = [System.Web.HttpUtility]::UrlDecode($req.Url.AbsolutePath)

        if ($path -eq "/api/data") {
            $force = $req.QueryString["fresh"] -eq "1"
            if ($force) { Start-Refresh; $lastKick = Get-Date }
            if (Test-Path $CacheFile) {
                $bytes = [IO.File]::ReadAllBytes($CacheFile)
                Send-Response $res 200 "application/json; charset=utf-8" $bytes
            } else {
                Send-Text $res 200 "application/json; charset=utf-8" '{"ok":false,"loading":true}'
            }
            continue
        }

        if ($path -eq "/") { $path = "/index.html" }
        $safe = $path.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
        $file = [IO.Path]::GetFullPath((Join-Path $Root $safe))
        if (-not $file.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase)) {
            Send-Text $res 403 "text/plain; charset=utf-8" "Forbidden"
            continue
        }
        if (Test-Path $file -PathType Leaf) {
            $bytes = [IO.File]::ReadAllBytes($file)
            Send-Response $res 200 (Get-MimeType $file) $bytes
        } else {
            Send-Text $res 404 "text/plain; charset=utf-8" "Not found"
        }
    } catch {
        if ($ctx -and $ctx.Response) {
            try { Send-Text $ctx.Response 500 "text/plain; charset=utf-8" $_.Exception.Message } catch {}
        }
        Write-Host $_.Exception.Message
    }
}
