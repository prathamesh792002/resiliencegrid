#!/bin/bash
# Quick deployment script for ResilienceGrid

set -e

echo "🚀 ResilienceGrid Deployment Script"
echo "===================================="

# Check Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from template..."
    cp .env.production .env
    
    # Generate SECRET_KEY
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(64))" 2>/dev/null || openssl rand -base64 64)
    sed -i.bak "s/CHANGE_ME_RANDOM_SECRET_KEY_64_CHARS_MIN/$SECRET_KEY/" .env
    
    echo "⚠️  Please edit .env and set POSTGRES_PASSWORD"
    echo "   Then run this script again."
    exit 0
fi

# Check POSTGRES_PASSWORD is set
if grep -q "CHANGE_ME_STRONG_PASSWORD" .env; then
    echo "❌ Please set POSTGRES_PASSWORD in .env file"
    exit 1
fi

echo "✅ Environment configured"

# Build images
echo "🔨 Building Docker images..."
docker-compose build

# Start services
echo "🎬 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check health
echo "🏥 Checking service health..."
for i in {1..30}; do
    if docker-compose ps | grep -q "Up (healthy)"; then
        echo "✅ Services are healthy!"
        break
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

# Show status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access ResilienceGrid at: http://localhost"
echo "📡 Backend API at: http://localhost:8000"
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo ""
