$ErrorActionPreference = "Stop"
Add-Type -AssemblyName Microsoft.VisualBasic
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$OutFile = Join-Path $Root "cache\data.json"
$TmpOut = Join-Path $Root "cache\data.tmp.json"
$NamesFile = Join-Path $Root "cache\names.json"
$SheetUrl = "https://docs.google.com/spreadsheets/d/1l6EwjL3i0eNy3mdYlcUcOF8un1-31ycKJEL5cuZ9MkQ/export?format=csv&gid=841809744"
$PublishUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm8drSF8Zoa60ahlcWKiNSRKmvwWgaw39kXhbTlR4gtTDIqKDvYiCTla-YDqnsirHmWf5y9LeUMLvf/pub?gid=841809744&single=true&output=csv"

New-Item -ItemType Directory -Force -Path (Join-Path $Root "cache") | Out-Null

function Load-NamesMap([string]$Path) {
    $map = @{}
    if (-not (Test-Path $Path)) { return $map }
    try {
        $obj = Get-Content $Path -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($obj -and $obj.map) {
            foreach ($prop in $obj.map.PSObject.Properties) {
                $map[$prop.Name] = $prop.Value
            }
        }
    } catch {
        # A broken names cache should not break the picking dashboard.
    }
    return $map
}

function Get-DisplayName([string]$Username, [hashtable]$NamesMap, [string]$Fallback) {
    $local = $Username.Split("@")[0]
    if ($local.Length -ge 9) {
        $key = $local.Substring(0, 9).ToUpperInvariant()
        if ($NamesMap.ContainsKey($key)) { return $NamesMap[$key] }
    }
    return $Fallback
}

function Download-Sheet([string]$Url, [string]$Dest) {
    $req = [System.Net.HttpWebRequest]::Create($Url)
    $req.Method = "GET"
    $req.UserAgent = "Mozilla/5.0 PickDash"
    $req.AllowAutoRedirect = $true
    $req.Timeout = 120000
    $res = $req.GetResponse()
    try {
        $stream = $res.GetResponseStream()
        $file = [IO.File]::Create($Dest)
        try { $stream.CopyTo($file) } finally { $file.Close(); $stream.Close() }
    } finally {
        $res.Close()
    }
}

function Parse-PickedAt([string]$Value) {
    if ([string]::IsNullOrWhiteSpace($Value)) { return $null }
    $m = [regex]::Match($Value.Trim(), '^(\d{1,2})/(\d{1,2})/(\d{2,4})\s+(\d{1,2}):(\d{2})')
    if (-not $m.Success) { return $null }
    $month = [int]$m.Groups[1].Value
    $day = [int]$m.Groups[2].Value
    $year = [int]$m.Groups[3].Value
    if ($year -lt 100) { $year += 2000 }
    $hour = [int]$m.Groups[4].Value
    return [pscustomobject]@{
        Date = "{0:D4}-{1:D2}-{2:D2}" -f $year, $month, $day
        Hour = $hour
    }
}

$tmp = Join-Path $env:TEMP "pick-dash-live.csv"
$source = $SheetUrl
try {
    Download-Sheet $SheetUrl $tmp
} catch {
    $source = $PublishUrl
    Download-Sheet $PublishUrl $tmp
}

$parser = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser($tmp, [Text.Encoding]::UTF8)
$parser.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
$parser.SetDelimiters(",")
$parser.HasFieldsEnclosedInQuotes = $true

if ($parser.EndOfData) {
    $parser.Close()
    throw "Sheet is empty"
}

$header = $parser.ReadFields()
$idxUser = [array]::IndexOf($header, "username")
$idxSku = [array]::IndexOf($header, "sku")
$idxPicked = [array]::IndexOf($header, "picked_at")
$idxStatus = [array]::IndexOf($header, "line_status")

if ($idxUser -lt 0 -or $idxSku -lt 0 -or $idxPicked -lt 0) {
    $parser.Close()
    throw "Missing columns: username / sku / picked_at"
}

$namesMap = Load-NamesMap $NamesFile

$users = @{}
$allSkus = @{}
$daysSet = @{}
$total = 0
$skipped = 0

while (-not $parser.EndOfData) {
    $fields = $parser.ReadFields()
    if (-not $fields) { continue }
    if ($idxStatus -ge 0 -and $idxStatus -lt $fields.Length) {
        $status = $fields[$idxStatus]
        if ($status -and $status -ne "picked") { $skipped++; continue }
    }

    $when = Parse-PickedAt $(if ($idxPicked -lt $fields.Length) { $fields[$idxPicked] } else { "" })
    if (-not $when) { continue }

    $user = $(if ($idxUser -lt $fields.Length) { $fields[$idxUser] } else { "" }).Trim()
    $sku = $(if ($idxSku -lt $fields.Length) { $fields[$idxSku] } else { "" }).Trim()
    if (-not $user) { continue }

    $total++
    $daysSet[$when.Date] = $true
    if ($sku) { $allSkus[$sku] = $true }

    if (-not $users.ContainsKey($user)) {
        $users[$user] = @{
            username = $user
            name = ($user.Split("@")[0])
            total = 0
            unique = @{}
            days = @{}
        }
    }

    $u = $users[$user]
    $u.total++
    if ($sku) { $u.unique[$sku] = $true }

    if (-not $u.days.ContainsKey($when.Date)) {
        $hourSkus = New-Object object[] 24
        for ($i = 0; $i -lt 24; $i++) { $hourSkus[$i] = @{} }
        $u.days[$when.Date] = @{
            total = 0
            unique = @{}
            hoursQty = New-Object int[] 24
            hourSkus = $hourSkus
        }
    }

    $day = $u.days[$when.Date]
    $day.total++
    if ($sku) { $day.unique[$sku] = $true }
    if ($when.Hour -ge 0 -and $when.Hour -le 23) {
        $day.hoursQty[$when.Hour]++
        if ($sku) { $day.hourSkus[$when.Hour][$sku] = $true }
    }
}
$parser.Close()

$userList = foreach ($key in $users.Keys) {
    $u = $users[$key]
    $dayMap = @{}
    foreach ($d in $u.days.Keys) {
        $info = $u.days[$d]
        $hoursSku = New-Object int[] 24
        for ($i = 0; $i -lt 24; $i++) {
            $hoursSku[$i] = [int]$info.hourSkus[$i].Count
        }
        $dayMap[$d] = @{
            qty = [int]$info.total
            uniqueSkus = [int]$info.unique.Count
            hoursQty = @($info.hoursQty)
            hoursSku = @($hoursSku)
        }
    }
    [ordered]@{
        username = $u.username
        name = $u.name
        displayName = (Get-DisplayName $u.username $namesMap $u.name)
        total = [int]$u.total
        uniqueSkus = [int]$u.unique.Count
        days = $dayMap
    }
}

$sortedUsers = @($userList | Sort-Object { $_.total } -Descending)
$days = @($daysSet.Keys | Sort-Object)

$data = [ordered]@{
    ok = $true
    source = $source
    fetchedAt = (Get-Date).ToString("o")
    totalPicks = $total
    uniqueUsers = $sortedUsers.Count
    uniqueSkus = $allSkus.Count
    skipped = $skipped
    days = $days
    users = $sortedUsers
}

$json = $data | ConvertTo-Json -Depth 8 -Compress
$utf8 = New-Object System.Text.UTF8Encoding $false
[IO.File]::WriteAllText($TmpOut, $json, $utf8)
Move-Item -Path $TmpOut -Destination $OutFile -Force
Write-Output "OK picks=$total users=$($sortedUsers.Count) days=$($days -join ',')"
