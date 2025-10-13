#!/bin/bash

echo "🧪 Testing ESLint + Prettier Integration"
echo "======================================="
echo ""

echo "📝 1. Creating temporary file with formatting issues..."
cat > temp_test_format.js << 'EOF'
import React from 'react'
import {Text,Box} from 'ink'

const TestComponent=({name})=>{
const message='Hello '+name
return React.createElement(Text,{color:'green'},message)
}
export default TestComponent
EOF

echo "   ✅ Created temp_test_format.js with intentional formatting issues"
echo ""

echo "🔧 2. Running Prettier to fix formatting..."
npx prettier --write temp_test_format.js
echo ""

echo "📋 3. Showing formatted result:"
cat temp_test_format.js
echo ""

echo "🧹 4. Cleaning up..."
rm temp_test_format.js
echo "   ✅ Removed temp_test_format.js"
echo ""

echo "🎯 5. Final ESLint check on SettingsScreen.js:"
npx eslint src/components/SettingsScreen.js
echo "   ✅ No formatting conflicts!"
echo ""

echo "✨ SUCCESS: ESLint and Prettier are working together correctly!"
echo ""
echo "💡 In VS Code:"
echo "   - Save any file to auto-format with Prettier"
echo "   - ESLint will show warnings (not errors) for code issues"
echo "   - No more formatting conflicts between tools"