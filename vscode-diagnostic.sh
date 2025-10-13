#!/bin/bash

echo "🔧 VS Code ESLint + Prettier Diagnostic Tool"
echo "============================================"
echo ""

echo "📋 1. Checking installed extensions..."
echo "   Make sure these extensions are installed in VS Code:"
echo "   - ESLint (dbaeumer.vscode-eslint)" 
echo "   - Prettier - Code formatter (esbenp.prettier-vscode)"
echo ""

echo "📝 2. Testing ESLint configuration..."
npx eslint --print-config src/components/SettingsScreen.js > eslint-debug.json
echo "   ✅ ESLint config exported to eslint-debug.json"
echo ""

echo "🎨 3. Testing Prettier configuration..."
echo "   Prettier config:"
cat .prettierrc
echo ""

echo "⚙️  4. VS Code settings check:"
echo "   Current .vscode/settings.json:"
cat .vscode/settings.json
echo ""

echo "🧪 5. Manual format test..."
echo "   Creating test file with bad formatting:"
cat > format-test.js << 'EOF'
const test={a:1,b:2,c:3}
const message='hello world'
EOF

echo "   Before formatting:"
cat format-test.js

echo ""
echo "   Running Prettier..."
npx prettier --write format-test.js

echo "   After formatting:"
cat format-test.js

echo ""
echo "🧹 Cleaning up..."
rm format-test.js eslint-debug.json
echo ""

echo "📌 VS Code Restart Instructions:"
echo "================================"
echo "1. Close VS Code completely (Cmd+Q / Ctrl+Q)"
echo "2. Reopen VS Code"  
echo "3. Open Command Palette (Cmd/Ctrl+Shift+P)"
echo "4. Run: 'ESLint: Restart ESLint Server'"
echo "5. Run: 'Developer: Reload Window'"
echo "6. Try editing SettingsScreen.js again"
echo ""
echo "💡 If still having issues, check VS Code Output panel:"
echo "   View > Output > Select 'ESLint' from dropdown"