#!/bin/bash

echo "🎯 Testing ESLint and Prettier setup..."
echo ""

echo "📝 Running ESLint check..."
npm run lint
echo ""

echo "🎨 Running Prettier format check..."
npm run format:check
echo ""

echo "✅ Setup complete! Your linting and formatting is now configured."
echo ""
echo "📖 Available commands:"
echo "  npm run lint          - Check for linting issues"
echo "  npm run lint:fix      - Fix auto-fixable linting issues"
echo "  npm run format        - Format all files with Prettier"  
echo "  npm run format:check  - Check if files are properly formatted"
echo ""
echo "🔧 VS Code settings:"
echo "  - Format on save: enabled"
echo "  - ESLint auto-fix on save: enabled"
echo "  - Recommended extensions will be suggested"