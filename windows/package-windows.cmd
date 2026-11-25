@echo off
setlocal

for %%I in ("%~dp0..") do set "REPO_ROOT=%%~fI"
set "PROJECT=%~dp0KeySwap.Desktop\KeySwap.Desktop.csproj"
set "PUBLISH_PATH=%REPO_ROOT%\artifacts\KeySwap-win-x64"
set "ARCHIVE_PATH=%REPO_ROOT%\artifacts\KeySwap-win-x64.zip"

if exist "%PUBLISH_PATH%" rmdir /S /Q "%PUBLISH_PATH%"
if errorlevel 1 exit /b %errorlevel%
mkdir "%PUBLISH_PATH%"
if errorlevel 1 exit /b %errorlevel%
dotnet publish "%PROJECT%" --configuration Release --runtime win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:PublishDir="%PUBLISH_PATH%"
if errorlevel 1 exit /b %errorlevel%
if not exist "%PUBLISH_PATH%\KeySwap.exe" (
  echo ERROR: dotnet publish did not produce KeySwap.exe.
  exit /b 1
)
if not exist "%PUBLISH_PATH%\wwwroot\app.js" (
  echo ERROR: dotnet publish did not produce the KeySwap web interface.
  exit /b 1
)

copy /Y "%~dp0INSTALL.txt" "%PUBLISH_PATH%\INSTALL.txt" >nul
if errorlevel 1 exit /b %errorlevel%

if exist "%ARCHIVE_PATH%" del "%ARCHIVE_PATH%"
set "KEYSWAP_PUBLISH_PATH=%PUBLISH_PATH%"
set "KEYSWAP_ARCHIVE_PATH=%ARCHIVE_PATH%"
powershell.exe -NoProfile -Command "Compress-Archive -Path (Join-Path $env:KEYSWAP_PUBLISH_PATH '*') -DestinationPath $env:KEYSWAP_ARCHIVE_PATH -Force"
if errorlevel 1 exit /b %errorlevel%

echo Created "%ARCHIVE_PATH%"
