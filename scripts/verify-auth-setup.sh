#!/bin/bash

# Script para verificar la configuración de autenticación

echo "🔍 Verificando configuración de autenticación..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Archivo .env.local no encontrado"
    echo "   Ejecuta: cp .env.example .env.local"
    exit 1
fi

echo "✅ .env.local encontrado"

# Check required env vars
REQUIRED_VARS=("NEXTAUTH_SECRET" "NEXTAUTH_URL" "GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET" "ADMIN_EMAIL")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env.local; then
        MISSING_VARS+=("$var")
    elif grep -q "^${var}=your-" .env.local || grep -q "^${var}=$" .env.local; then
        echo "⚠️  $var está configurado pero parece tener valor placeholder"
    else
        echo "✅ $var configurado"
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    echo "❌ Variables faltantes en .env.local:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    exit 1
fi

echo ""
echo "🎯 Próximos pasos:"
echo ""
echo "1. Obtener credenciales Google OAuth:"
echo "   https://console.cloud.google.com/apis/credentials"
echo ""
echo "2. Configurar redirect URI:"
echo "   http://localhost:3000/api/auth/callback/google"
echo ""
echo "3. Actualizar .env.local con Client ID y Secret reales"
echo ""
echo "4. Ejecutar: npm run dev"
echo ""
echo "5. Visitar: http://localhost:3000/login"
echo ""

# Check if dependencies are installed
if [ ! -d node_modules/next-auth ]; then
    echo "⚠️  next-auth no está instalado"
    echo "   Ejecuta: npm install"
    exit 1
fi

echo "✅ Dependencias instaladas correctamente"
echo ""
echo "🚀 Todo listo! Ejecuta 'npm run dev' para empezar"
