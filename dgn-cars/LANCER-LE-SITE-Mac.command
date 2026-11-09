#!/bin/bash
cd "$(dirname "$0")"
echo "=== DGN Cars - lancement du site en local ==="
if ! command -v node >/dev/null 2>&1; then echo "Node.js n'est pas installé. Téléchargez-le sur https://nodejs.org puis relancez ce fichier."; read -r; exit 1; fi
[ -d node_modules ] || { echo "Installation des composants, quelques minutes la première fois..."; npm install || { read -r; exit 1; }; }
npm run local
