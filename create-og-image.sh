#!/bin/bash

# Script to create OG image using browser screenshot
# Requires Chrome/Chromium to be installed

echo "Creating OG image for FairSplit..."

# Check if Chrome is available
if command -v google-chrome &> /dev/null; then
    CHROME="google-chrome"
elif command -v chromium &> /dev/null; then
    CHROME="chromium"
elif command -v "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" &> /dev/null; then
    CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
else
    echo "Chrome not found. Please install Chrome or use manual method."
    echo ""
    echo "Manual method:"
    echo "1. Open public/og-image-placeholder.html in your browser"
    echo "2. Press F12 to open DevTools"
    echo "3. Right-click the purple gradient box"
    echo "4. Select 'Capture node screenshot'"
    echo "5. Save as public/og-image.png"
    exit 1
fi

# Create screenshot using headless Chrome
"$CHROME" --headless --screenshot=public/og-image.png --window-size=1200,630 --default-background-color=0 public/og-image-placeholder.html

if [ -f "public/og-image.png" ]; then
    echo "✅ OG image created successfully at public/og-image.png"
    ls -lh public/og-image.png
else
    echo "❌ Failed to create OG image"
    exit 1
fi
