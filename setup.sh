#!/bin/bash

# I'm a Wife App Setup Script
# This script helps set up the enhanced app with all new features

echo "=========================================="
echo "I'm a Wife App - Enhanced Version Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm is installed: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check the error above."
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  Warning: .env.local file not found!"
    echo "The app needs SMTP credentials to send emails."
    echo ""
    echo "Create a .env.local file with:"
    echo "ZOHO_SMTP_HOST=smtp.zoho.com"
    echo "ZOHO_SMTP_PORT=465"
    echo "ZOHO_SMTP_USER=your-email@example.com"
    echo "ZOHO_SMTP_PASSWORD=your-app-password"
    echo "ZOHO_SMTP_FROM=from-email@example.com"
    echo ""
    read -p "Would you like to create .env.local now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cat > .env.local << EOF
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=your-email@example.com
ZOHO_SMTP_PASSWORD=your-app-password
ZOHO_SMTP_FROM=from-email@example.com
EOF
        echo "✅ Created .env.local template. Please update with your actual credentials."
    fi
else
    echo "✅ .env.local file found."
fi

# Display setup instructions
echo ""
echo "=========================================="
echo "🎉 Setup Complete!"
echo "=========================================="
echo ""
echo "To start the app:"
echo ""
echo "1. Start the server (in one terminal):"
echo "   npm start"
echo ""
echo "2. The server will run on: http://localhost:3001"
echo ""
echo "3. Open index.html in your browser to use the app"
echo ""
echo "4. For SMTP email sending, make sure your Zoho"
echo "   credentials in .env.local are correct."
echo ""
echo "=========================================="
echo "New Features Available:"
echo "=========================================="
echo "• 📱 Mobile-first responsive design"
echo "• ✉️  SMTP email with 'You Messed Up' subject"
echo "• 🔗 Paste any link to share in emails"
echo "• 💝 25 affirmations, 12 situations, 12 gift options"
echo "• ⚡ Dual send options (Mail app or SMTP)"
echo ""

# Ask if user wants to start the server now
read -p "Would you like to start the server now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting server..."
    echo "Press Ctrl+C to stop the server"
    echo ""
    npm start
fi