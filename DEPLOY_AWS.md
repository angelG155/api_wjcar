# Guía de Despliegue en AWS

## Índice
1. [Preparación Local](#1-preparación-local)
2. [Configuración de AWS](#2-configuración-de-aws)
3. [Configuración del Servidor](#3-configuración-del-servidor)
4. [Despliegue de la Aplicación](#4-despliegue-de-la-aplicación)
5. [Configuración de Nginx](#5-configuración-de-nginx)
6. [Configuración de SSL](#6-configuración-de-ssl)
7. [Mantenimiento](#7-mantenimiento)

## 1. Preparación Local

### 1.1 Preparar el Proyecto
```bash
# Asegúrate de que todo esté commiteado en git
git status

# Instalar dependencias
npm install

# Probar build local
npm run build

# Crear archivo de despliegue
npm run deploy
```

### 1.2 Verificar Archivos de Configuración
- Asegúrate de que `.env.production` tenga los valores correctos
- Verifica que `ecosystem.config.js` esté configurado
- El archivo `deploy.zip` debería estar en la carpeta `dist/`

## 2. Configuración de AWS

### 2.1 Crear una Instancia EC2
1. Ve a AWS Console → EC2 → Launch Instance
2. Selecciona "Ubuntu Server 22.04 LTS"
3. Elige t2.micro (capa gratuita) o t2.small
4. Configuración de la instancia:
   - Red: VPC predeterminada
   - Subred: Cualquier zona disponible
   - Auto-assign Public IP: Enable

### 2.2 Configurar Grupo de Seguridad
Añade las siguientes reglas de entrada:
- SSH (22): Tu IP
- HTTP (80): Anywhere
- HTTPS (443): Anywhere
- Custom TCP (3000): Anywhere (puerto de la aplicación)

### 2.3 Par de Claves
- Crea un nuevo par de claves
- Descarga el archivo .pem
- Guárdalo en un lugar seguro

### 2.4 Elastic IP (Recomendado)
1. EC2 → Elastic IPs → Allocate
2. Selecciona la IP y asocia a tu instancia
3. Guarda la IP para usar más tarde

## 3. Configuración del Servidor

### 3.1 Conectar al Servidor
```bash
# Dar permisos al archivo .pem
chmod 400 tu-key.pem

# Conectar vía SSH
ssh -i tu-key.pem ubuntu@tu-ip-elastic
```

### 3.2 Instalar Dependencias
```bash
# Actualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx

# Instalar otros utilitarios
sudo apt install -y zip unzip
```

### 3.3 Configurar Directorios
```bash
# Crear directorio para la aplicación
mkdir -p ~/apps/api-autos

# Crear directorio para logs
mkdir -p ~/logs/api-autos

# Crear directorio para archivos subidos
mkdir -p ~/storage/api-autos
```

## 4. Despliegue de la Aplicación

### 4.1 Subir Archivos
```bash
# Desde tu máquina local
scp -i tu-key.pem dist/deploy.zip ubuntu@tu-ip-elastic:~/apps/api-autos/

# En el servidor
cd ~/apps/api-autos
unzip deploy.zip
```

### 4.2 Configurar Variables de Entorno
```bash
# Editar .env
nano .env

# Asegúrate de configurar:
DB_HOST=tu-host-db
DB_USER=tu-usuario
DB_PASSWORD=tu-contraseña
DB_NAME=tu-base-de-datos
JWT_SECRET=tu-secreto-muy-largo
```

### 4.3 Iniciar la Aplicación
```bash
# Iniciar con PM2
pm2 start ecosystem.config.js --env production

# Guardar configuración de PM2
pm2 save

# Configurar inicio automático
pm2 startup
```

## 5. Configuración de Nginx

### 5.1 Crear Configuración de Nginx
```bash
sudo nano /etc/nginx/sites-available/api-autos
```

Contenido:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Logs
    access_log /home/ubuntu/logs/api-autos/nginx-access.log;
    error_log /home/ubuntu/logs/api-autos/nginx-error.log;

    # Proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos estáticos
    location /storage {
        alias /home/ubuntu/storage/api-autos;
        expires 30d;
    }
}
```

### 5.2 Activar el Sitio
```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/api-autos /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## 6. Configuración de SSL

### 6.1 Instalar Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtener Certificado
```bash
sudo certbot --nginx -d tu-dominio.com
```

## 7. Mantenimiento

### 7.1 Comandos Útiles
```bash
# Ver logs de la aplicación
pm2 logs api-autos

# Monitorear la aplicación
pm2 monit

# Reiniciar la aplicación
pm2 restart api-autos

# Ver estado de PM2
pm2 status

# Actualizar la aplicación
cd ~/apps/api-autos
unzip -o nuevo-deploy.zip
pm2 restart api-autos
```

### 7.2 Respaldos
```bash
# Respaldar base de datos (si es local)
mysqldump -u usuario -p nombre_db > backup.sql

# Respaldar archivos subidos
tar -czf storage-backup.tar.gz ~/storage/api-autos
```

### 7.3 Monitoreo
- Configura alertas en AWS CloudWatch
- Revisa los logs regularmente
- Monitorea el uso de recursos con PM2

### 7.4 Seguridad
- Actualiza regularmente el sistema
- Revisa los logs de acceso de Nginx
- Mantén actualizadas las dependencias de Node.js
- Rota las claves de acceso y secretos periódicamente

## Notas Importantes
- Guarda todos los secretos y contraseñas de forma segura
- Documenta cualquier cambio en la configuración
- Mantén un registro de los despliegues
- Ten un plan de rollback en caso de problemas 