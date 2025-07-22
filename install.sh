#!/bin/bash

echo "🚀 Mobile App Backend Installation Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MIN_VERSION="16.0.0"

if ! node -p "require('semver').gte('$NODE_VERSION', '$MIN_VERSION')" &> /dev/null; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads/temp
mkdir -p logs

echo "✅ Directories created"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please configure your .env file with actual values"
fi

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if pgrep mongod > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB service."
    fi
else
    echo "⚠️  MongoDB not found. Please install MongoDB or configure remote connection."
fi

echo ""
echo "🎉 Installation completed!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with actual service credentials"
echo "2. Start MongoDB (if using local instance)"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit http://localhost:3000/health to check if the server is running"
echo ""
echo "📚 Documentation: README.md"
echo "🔧 Configuration: .env"
echo ""
