$ErrorActionPreference = "Stop"
Add-Type -AssemblyName Microsoft.VisualBasic
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$OutFile = Join-Path $Root "cache\names.json"
$TmpOut = Join-Path $Root "cache\names.tmp.json"
$SheetId = "1GaMh4GIfanzEvJYpbtvuVLpawERz_-kRzSrWyqovpXs"

# Tabs in the attendance sheet that hold an ID / Employee Name table (one per hub/team).
$Tabs = [ordered]@{
    "CAIID01" = "11379924"
    "CAIDS09" = "348453301"
    "CAIDS10" = "383489006"
    "CAIDS11" = "439385737"
    "CAIDS12" = "866414450"
    "CAIDS13" = "336490703"
    "CAIDS14" = "222984670"
    "CAIDS15" = "1477803256"
    "CAIDS16" = "557209814"
    "CAIDS17" = "289183708"
    "CAIDS18" = "1364218410"
    "CAIDS19" = "1139704174"
    "CAIDS20" = "1048268651"
    "CAIDS22" = "222883955"
    "CAIDS21" = "967970317"
    "CAIDS23" = "634981370"
    "CAIDS32" = "724327074"
    "CAIDS30" = "1763961627"
    "CAIDS24" = "1674119066"
    "CAIDS25" = "829064114"
    "CAIDS26" = "286814288"
    "CAIDS27" = "148578138"
    "CAIDS28" = "764960307"
    "ALYDS02" = "1373745072"
    "ALYDS03" = "1706483175"
}

New-Item -ItemType Directory -Force -Path (Join-Path $Root "cache") | Out-Null

function Download-Sheet([string]$Url, [string]$Dest) {
    $req = [System.Net.HttpWebRequest]::Create($Url)
    $req.Method = "GET"
    $req.UserAgent = "Mozilla/5.0 PickDash"
    $req.AllowAutoRedirect = $true
    $req.Timeout = 60000
    $res = $req.GetResponse()
    try {
        $stream = $res.GetResponseStream()
        $file = [IO.File]::Create($Dest)
        try { $stream.CopyTo($file) } finally { $file.Close(); $stream.Close() }
    } finally {
        $res.Close()
    }
}

function Read-IdNameMap([string]$Path) {
    $result = @{}
    try {
        $p = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser($Path, [Text.Encoding]::UTF8)
        $p.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
        $p.SetDelimiters(",")
        $p.HasFieldsEnclosedInQuotes = $true
        $null = $p.ReadFields()
        $header = $p.ReadFields()
        $idxId = [array]::IndexOf($header, "ID")
        $idxName = [array]::IndexOf($header, "Employee Name")
        if ($idxId -lt 0 -or $idxName -lt 0) { $p.Close(); return $result }
        while (-not $p.EndOfData) {
            $f = $p.ReadFields()
            if (-not $f -or $f.Length -le $idxName) { continue }
            $id = ($f[$idxId] + "").Trim()
            $name = ($f[$idxName] + "").Trim() -replace '\s+', ' '
            if ($id.Length -ge 9 -and $name) {
                $key = $id.Substring(0, 9).ToUpperInvariant()
                if ($key -and -not $result.ContainsKey($key)) { $result[$key] = $name }
            }
        }
        $p.Close()
    } catch {
        # Ignore a single broken tab; keep whatever else we can map.
    }
    return $result
}

$combined = @{}
$tmpDir = Join-Path $env:TEMP "pick-dash-names"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null
$okTabs = 0

foreach ($tab in $Tabs.Keys) {
    $gid = $Tabs[$tab]
    $dest = Join-Path $tmpDir "$tab.csv"
    try {
        Download-Sheet "https://docs.google.com/spreadsheets/d/$SheetId/export?format=csv&gid=$gid" $dest
        $map = Read-IdNameMap $dest
        foreach ($key in $map.Keys) {
            if (-not $combined.ContainsKey($key)) { $combined[$key] = $map[$key] }
        }
        if ($map.Count -gt 0) { $okTabs++ }
    } catch {
        # Skip tabs that fail to download; the rest still get merged in.
    }
}

$payload = [ordered]@{
    updatedAt = (Get-Date).ToString("o")
    tabsLoaded = $okTabs
    count = $combined.Count
    map = $combined
}

$json = $payload | ConvertTo-Json -Depth 4 -Compress
$utf8 = New-Object System.Text.UTF8Encoding $false
[IO.File]::WriteAllText($TmpOut, $json, $utf8)
Move-Item -Path $TmpOut -Destination $OutFile -Force
Write-Output "OK names=$($combined.Count) tabs=$okTabs/$($Tabs.Count)"
