<#
.SYNOPSIS
    Scans a source directory for UI components and analyzes their potential for generalization.
.DESCRIPTION
    Extracts component files, line counts, imports, business coupling indicators, and exports,
    outputting structured JSON or human-readable summary.
.PARAMETER SourceDir
    The target directory containing components to analyze.
.PARAMETER Extensions
    File extensions to include. Defaults to .tsx, .jsx, .vue, .qml.
.PARAMETER OutputJson
    Switch to output raw JSON instead of formatted text.
.EXAMPLE
    pwsh .agents/skills/component-scout/scripts/scan-components.ps1 -SourceDir "../my-app/src/components"
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$SourceDir,

    [string[]]$Extensions = @("*.tsx", "*.jsx", "*.vue", "*.qml"),

    [string[]]$ExcludeDirs = @("node_modules", "dist", "build", ".git", ".next", "coverage", "__tests__", "test"),

    [switch]$OutputJson
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SourceDir)) {
    Write-Error "Source directory not found: $SourceDir"
    exit 1
}

$resolvedDir = (Resolve-Path -LiteralPath $SourceDir).Path

# Regex patterns for business coupling indicators
$businessImportRegex = '(?i)from\s+[''"].*(?:api|service|services|store|stores|redux|zustand|pinia|mobx|queries|mutations|hooks\/use[A-Z].*biz|auth|user-context).*[''"]'
$hardcodedHttpRegex = '(?i)(?:fetch\(|axios\.(?:get|post|put|delete)|useQuery\(|useMutation\()'
$businessModelRegex = '(?i)\b(?:Order|Invoice|Payment|Billing|Tenant|Customer|Contract|UserProfile|Employee|Permission|Role)\b'
$slotOrChildrenRegex = '(?i)(?:children|render\w+|slots?|slot\w+|header|footer|actions|fallback)\b'

$results = [System.Collections.Generic.List[PSCustomObject]]::new()

$files = Get-ChildItem -LiteralPath $resolvedDir -Recurse -File -Include $Extensions | Where-Object {
    $itemPath = $_.FullName
    $fileName = $_.Name
    if ($fileName -match '(?i)\.(?:test|spec|stories|d)\.[^.]+$') { return $false }
    $excluded = $false
    foreach ($ex in $ExcludeDirs) {
        if ($itemPath -match "[\\/]$([regex]::Escape($ex))[\\/]") {
            $excluded = $true
            break
        }
    }
    -not $excluded
}

foreach ($file in $files) {
    $content = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction SilentlyContinue
    if ([string]::IsNullOrWhiteSpace($content)) { continue }

    $lines = ($content -split "`r?`n").Count
    $relativePath = $file.FullName.Substring($resolvedDir.Length).TrimStart('\', '/')

    # Business coupling analysis
    $bizImports = [regex]::Matches($content, $businessImportRegex).Count
    $httpCalls = [regex]::Matches($content, $hardcodedHttpRegex).Count
    $bizModels = [regex]::Matches($content, $businessModelRegex).Count
    $slotCount = [regex]::Matches($content, $slotOrChildrenRegex).Count

    # Determine coupling score (0 = pure visual, 10 = tightly coupled to business)
    $couplingScore = [Math]::Min(10, ($bizImports * 2) + ($httpCalls * 3) + [Math]::Min(3, [int]($bizModels / 2)))
    if ($slotCount -gt 3) {
        $couplingScore = [Math]::Max(0, $couplingScore - 2) # Slots / render props reduce coupling
    }

    # Extract component name from file name or export
    $compName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)

    # Heuristic tier and recommendation
    $recommendation = "DISCARD"
    if ($couplingScore -le 2) {
        $recommendation = "DIRECT_ADOPT"
    } elseif ($couplingScore -le 5) {
        $recommendation = "ABSTRACT_AND_ADOPT"
    } else {
        $recommendation = "KEEP_IN_APP"
    }

    $results.Add([PSCustomObject]@{
        Name            = $compName
        RelativePath    = $relativePath
        Extension       = $file.Extension
        Lines           = $lines
        CouplingScore   = $couplingScore
        BusinessImports = $bizImports
        HttpCalls       = $httpCalls
        DomainEntities  = $bizModels
        HasSlots        = ($slotCount -gt 0)
        Recommendation  = $recommendation
    })
}

if ($OutputJson) {
    $results | ConvertTo-Json -Depth 4
} else {
    Write-Host "`n=== Component Scout: Scan Results ($($results.Count) components discovered) ===" -ForegroundColor Cyan
    Write-Host "Target: $resolvedDir`n"

    $grouped = $results | Group-Object Recommendation
    foreach ($grp in $grouped) {
        $color = switch ($grp.Name) {
            "DIRECT_ADOPT"       { "Green" }
            "ABSTRACT_AND_ADOPT" { "Yellow" }
            "KEEP_IN_APP"        { "DarkGray" }
            default              { "White" }
        }
        Write-Host "[$($grp.Name) - $($grp.Count) items]" -ForegroundColor $color
        foreach ($item in $grp.Group) {
            Write-Host ("  - {0,-28} (Coupling: {1}/10, Lines: {2}, Path: {3})" -f $item.Name, $item.CouplingScore, $item.Lines, $item.RelativePath)
        }
        Write-Host ""
    }
}
