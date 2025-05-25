@echo off
setlocal

REM --- Configuration ---
SET NODE_VERSION=v18.17.0
SET NODE_ARCH=x64
SET NODE_DIST_URL=https://nodejs.org/dist/%NODE_VERSION%/node-%NODE_VERSION%-win-%NODE_ARCH%.zip
SET NODE_ZIP_FILE=node-%NODE_VERSION%-win-%NODE_ARCH%.zip
SET NODE_EXTRACTED_FOLDER_NAME=node-%NODE_VERSION%-win-%NODE_ARCH%

SET ELECTRON_APP_DIR=%~dp0
SET PORTABLE_NODE_DIR=%ELECTRON_APP_DIR%portable-node
SET PORTABLE_EXPO_DIR=%ELECTRON_APP_DIR%portable-expo
SET STAGING_NODE_DIR=%PORTABLE_NODE_DIR%\node
SET STAGING_EXPO_MODULES_DIR=%PORTABLE_EXPO_DIR%\node_modules

echo =====================================================
echo ChronaFlowServer Installer Creation Script
echo =====================================================
echo.
echo Electron App Dir: %ELECTRON_APP_DIR%
echo Portable Node Dir: %PORTABLE_NODE_DIR%
echo Portable Expo Dir: %PORTABLE_EXPO_DIR%
echo.

REM --- Cleanup previous attempts ---
echo Cleaning up previous portable directories...
if exist "%PORTABLE_NODE_DIR%" (
    rmdir /s /q "%PORTABLE_NODE_DIR%"
)
if exist "%PORTABLE_EXPO_DIR%" (
    rmdir /s /q "%PORTABLE_EXPO_DIR%"
)
if exist "%ELECTRON_APP_DIR%dist" (
    rmdir /s /q "%ELECTRON_APP_DIR%dist"
)
mkdir "%PORTABLE_NODE_DIR%"
mkdir "%PORTABLE_EXPO_DIR%"
echo Done cleaning.
echo.

REM --- 1. Download and Extract Portable Node.js ---
echo Downloading Node.js %NODE_VERSION% for %NODE_ARCH%...
if exist "%NODE_ZIP_FILE%" del "%NODE_ZIP_FILE%"
curl -L -o "%NODE_ZIP_FILE%" "%NODE_DIST_URL%"
if errorlevel 1 (
    echo ERROR: Failed to download Node.js.
    goto :error
)
echo Download complete.
echo.

echo Extracting Node.js...
powershell -Command "Expand-Archive -Path '%CD%\%NODE_ZIP_FILE%' -DestinationPath '%PORTABLE_NODE_DIR%'"
if errorlevel 1 (
    echo ERROR: Failed to extract Node.js. Make sure PowerShell is available.
    goto :error
)
REM Rename the extracted folder to just "node"
move "%PORTABLE_NODE_DIR%\%NODE_EXTRACTED_FOLDER_NAME%" "%STAGING_NODE_DIR%"
if errorlevel 1 (
    echo ERROR: Failed to rename Node.js extracted folder.
    goto :error
)
del "%NODE_ZIP_FILE%"
echo Node.js extracted and staged to %STAGING_NODE_DIR%.
echo.

REM --- 2. Setup Portable Expo CLI ---
echo Setting up portable Expo CLI...
pushd "%PORTABLE_EXPO_DIR%"
echo Initializing temporary package.json for Expo CLI install...
call npm init -y > nul
echo Installing expo-cli locally...
REM Use the bundled node to install expo-cli to ensure compatibility
call "%STAGING_NODE_DIR%\npm.cmd" install expo-cli --save-dev --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Failed to install expo-cli.
    popd
    goto :error
)
REM No need to move node_modules, it's already in PORTABLE_EXPO_DIR/node_modules
echo Expo CLI installed to %STAGING_EXPO_MODULES_DIR%.
popd
echo.

REM --- 3. Install Electron App Dependencies ---
echo Installing Electron app dependencies...
pushd "%ELECTRON_APP_DIR%"
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install Electron app dependencies.
    popd
    goto :error
)
popd
echo Electron app dependencies installed.
echo.

REM --- 4. Package Electron App ---
echo Packaging Electron app (ChronaFlowServer.exe)...
pushd "%ELECTRON_APP_DIR%"
call npm run package
if errorlevel 1 (
    echo ERROR: Failed to package Electron app.
    popd
    goto :error
)
popd
echo Electron app packaged. Output should be in %ELECTRON_APP_DIR%dist\
echo.

echo =====================================================
echo SUCCESSFULLY CREATED ChronaFlowServer Installer!
echo Find it in: %ELECTRON_APP_DIR%dist\
echo =====================================================
goto :eof

:error
echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo SCRIPT FAILED! Please check the error messages above.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
exit /b 1

endlocal