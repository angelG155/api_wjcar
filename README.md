# API de Gestión de Autos

API REST desarrollada con Node.js, Express, TypeScript y MySQL para la gestión de un sistema de autos.

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd api-auto
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Copiar el archivo `.env.example` a `.env`
   - Modificar las variables según tu entorno

4. Crear la base de datos en MySQL:
```sql
CREATE DATABASE sistema_autos;
```

5. Compilar el proyecto:
```bash
npm run build
```

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints

### Autos

- `GET /api/autos` - Obtener todos los autos
- `GET /api/autos/:id` - Obtener un auto por ID
- `POST /api/autos` - Crear un nuevo auto
- `PUT /api/autos/:id` - Actualizar un auto
- `DELETE /api/autos/:id` - Eliminar un auto
- `GET /api/autos/estado` - Buscar autos por estado
- `PATCH /api/autos/:id/servicio` - Actualizar último servicio

### Ejemplo de Objeto Auto

```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "año": 2022,
  "color": "Rojo",
  "placas": "ABC123",
  "estado": "disponible",
  "ultimoServicio": "2024-03-15T00:00:00.000Z"
}
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm start` - Inicia el servidor en modo producción
- `npm run build` - Compila el proyecto
- `npm run lint` - Ejecuta el linter

## Tecnologías Utilizadas

- Node.js
- Express
- TypeScript
- Sequelize
- MySQL
- Joi (validaciones)
- Cors
- Helmet
- Morgan

## Estructura del Proyecto

```
src/
├── config/         # Configuraciones
├── controllers/    # Controladores
├── models/         # Modelos
├── routes/         # Rutas
├── services/       # Servicios
├── middlewares/    # Middlewares
├── utils/          # Utilidades
└── server.ts       # Archivo principal
```

## Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. 