param(
  [string]$InputPath = (Join-Path $PSScriptRoot '..\public\videos\founders-video.mp4'),
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\public\videos\founders-video-cropped.mp4'),
  [string]$Crop = '384:480:48:0',
  [int]$Crf = 20,
  [string]$Preset = 'medium'
)

function Resolve-FfmpegPath {
  $command = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $wingetPath = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe'
  if (Test-Path $wingetPath) {
    return $wingetPath
  }

  throw 'ffmpeg was not found. Install it first, or add it to PATH.'
}

$ffmpegPath = Resolve-FfmpegPath
$resolvedInput = (Resolve-Path $InputPath).Path
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
$outputDirectory = Split-Path -Parent $resolvedOutput

if (-not (Test-Path $outputDirectory)) {
  New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

Write-Host "Cropping founder video with filter: crop=$Crop"

& $ffmpegPath `
  -y `
  -i $resolvedInput `
  -vf "crop=$Crop" `
  -c:v libx264 `
  -preset $Preset `
  -crf $Crf `
  -c:a aac `
  -b:a 192k `
  -movflags +faststart `
  $resolvedOutput

if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg failed with exit code $LASTEXITCODE"
}

Write-Host "Wrote cropped founder video to $resolvedOutput"
