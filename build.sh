#!/bin/bash
set -euo pipefail

# Step 1: Generate native projects if using the managed workflow.
echo "Running Expo prebuild (this generates native projects)..."
npx expo prebuild --non-interactive

# Step 2: Navigate to the android directory.
echo "Entering the android directory..."
cd android

# Step 3: Build the release APK using Gradle.
echo "Building the release APK using Gradle..."
./gradlew assembleRelease

echo "APK build complete!"
echo "You can find your APK at: ./app/build/outputs/apk/release/app-release.apk"
