#!/bin/bash

# Compilar TypeScript
echo "Compilando TypeScript..."
npm run build

# Crear directorio de despliegue
echo "Preparando archivos para despliegue..."
rm -rf dist/deploy
mkdir -p dist/deploy

# Copiar archivos necesarios
echo "Copiando archivos..."
cp package.json dist/deploy/
cp package-lock.json dist/deploy/
cp .env.production dist/deploy/.env
cp -r storage dist/deploy/

# Copiar archivos compilados (excluyendo la carpeta deploy)
find dist -maxdepth 1 -not -name deploy -not -name "dist" -exec cp -r {} dist/deploy/ \;

# Instalar solo dependencias de producción
echo "Instalando dependencias de producción..."
cd dist/deploy
npm install --production

# Comprimir para subir a AWS
echo "Comprimiendo archivos..."
zip -r ../deploy.zip .

cd ..
echo "¡Despliegue preparado!"
echo "El archivo deploy.zip está listo para ser subido a AWS"