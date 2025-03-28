-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS sistema_autos;

-- Usar la base de datos
USE sistema_autos;

-- Crear la tabla marcas
CREATE TABLE IF NOT EXISTS marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    paisOrigen VARCHAR(50) NOT NULL,
    logoUrl VARCHAR(255) DEFAULT 'storage/images/marcas/default-logo.png',
    activa BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_nombre (nombre),
    INDEX idx_pais (paisOrigen),
    INDEX idx_activa (activa)
);

-- Crear la tabla autos
CREATE TABLE IF NOT EXISTS autos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    anio INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    placas VARCHAR(255) NOT NULL UNIQUE,
    estado VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    imagenUrl VARCHAR(255) DEFAULT 'storage/images/autos/default-car.jpg',
    ultimoServicio DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_estado (estado),
    INDEX idx_placas (placas),
    INDEX idx_marca (marca),
    INDEX idx_precio (precio)
);

-- Comentarios de la tabla
ALTER TABLE autos 
COMMENT 'Tabla para almacenar información de los autos del sistema';

-- Insertar algunas marcas de ejemplo
INSERT INTO marcas (nombre, descripcion, paisOrigen) VALUES
    ('Toyota', 'Fabricante japonés de automóviles, conocido por su fiabilidad y calidad', 'Japón'),
    ('Honda', 'Empresa japonesa líder en la fabricación de automóviles y motocicletas', 'Japón'),
    ('Ford', 'Fabricante estadounidense de automóviles con una rica historia', 'Estados Unidos');

-- Insertar algunos autos de ejemplo
INSERT INTO autos (nombre, marca, modelo, anio, color, placas, estado, precio, imagenUrl) VALUES
    ('Corolla Sedan', 'Toyota', 'Corolla', 2020, 'Blanco', 'ABC123', 'Disponible', 25000.00, NULL),
    ('Civic Sport', 'Honda', 'Civic', 2021, 'Negro', 'XYZ789', 'Mantenimiento', 28000.00, NULL); 