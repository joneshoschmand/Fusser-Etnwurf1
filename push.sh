#!/bin/bash
# Push script for Fussner 2 project
cd "/Users/joneshoschmand/Desktop/Webseiten/Fussner 2"
echo "=== Current directory ==="
pwd
echo "=== Git status ==="
git status
echo "=== Adding all files ==="
git add -A
echo "=== Committing ==="
git commit -m "Update: Begriff auf Alltagsbetreuung geändert und Kontakt-Platzhalter aktualisiert" || echo "Nothing to commit"
echo "=== Pushing to GitHub ==="
git push -u origin main --force
echo "=== Done ==="
