#!/bin/bash
# usage ./generate_icons.sh icon_file.png

base=$1
convert "$base" -resize '16x16' -unsharp 1x4 "icon16.png"
convert "$base" -resize '32x32' -unsharp 1x4 "icon32.png"
convert "$base" -resize '48x48' -unsharp 1x4 "icon48.png"
convert "$base" -resize '128x128' -unsharp 1x4 "icon128.png"
convert "$base" -resize '300x300' -unsharp 1x4 "icon300.png"
