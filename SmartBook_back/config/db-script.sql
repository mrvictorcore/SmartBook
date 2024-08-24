-- Elimina la base de datos
DROP DATABASE IF EXISTS myhomestock;

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS myhomestock;
USE myhomestock;

-- Crear tabla de usuario
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(65) NOT NULL
);

-- Crear tabla de tipo_categoria
CREATE TABLE IF NOT EXISTS tipo_categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    nombre VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

-- Crear tabla de categoria
CREATE TABLE IF NOT EXISTS categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo INT,
    id_usuario INT,
    nombre VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_tipo) REFERENCES tipo_categoria(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

-- Crear tabla de unidad_medida
CREATE TABLE IF NOT EXISTS unidad_medida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    abreviatura VARCHAR(10) NOT NULL
);

-- Crear tabla de producto
CREATE TABLE IF NOT EXISTS producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_categoria INT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100),
    cantidad_stock INT DEFAULT 0 CHECK (cantidad_stock >= 0),
    cantidad_min_mensual INT DEFAULT 0 CHECK (cantidad_min_mensual >= 0),
    favorito BOOLEAN DEFAULT FALSE,
    id_unidad_medida INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id),
    FOREIGN KEY (id_unidad_medida) REFERENCES unidad_medida(id)
);

-- Crear tabla de compra 
CREATE TABLE IF NOT EXISTS compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    descripcion VARCHAR(100),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

-- Crear tabla de compra_producto
CREATE TABLE IF NOT EXISTS compra_producto (
    id_compra INT,
    id_producto INT,
    cantidad_comprar INT DEFAULT 0 CHECK (cantidad >= 0),
    FOREIGN KEY (id_producto) REFERENCES producto(id),
    FOREIGN KEY (id_compra) REFERENCES compra(id)
);

-- Agrega las columnas necesarias para la recuperación de contraseña
ALTER TABLE usuario
ADD COLUMN resetPasswordToken VARCHAR(255),
ADD COLUMN resetPasswordExpires BIGINT;

-- Agrega las columnas necesarias para la confirmación del email
ALTER TABLE usuario 
ADD COLUMN emailVerified BOOLEAN DEFAULT FALSE,
ADD COLUMN emailVerificationToken VARCHAR(255),
ADD COLUMN emailVerificationExpires BIGINT;

-- Insertar unidades de medida
INSERT INTO unidad_medida (nombre, abreviatura) VALUES 
('Kilos', 'kg'), 
('Unidades', 'unid'), 
('Litros', 'l'),
('Gramos', 'g'), 
('Mililitros', 'ml'), 
('Piezas', 'pcs'), 
('Paquetes', 'pkg'), 
('Metros', 'm'), 
('Centímetros', 'cm'), 
('Docenas', 'doc'), 
('Libras', 'lb'), 
('Onzas', 'oz'), 
('Cajas', 'cjs'), 
('Bolsas', 'bg'), 
('Tarros', 'jar'), 
('Botellas', 'btl'), 
('Sobres', 'sbr'), 
('Rollos', 'rl');

-- Insertar tipos de categoría
INSERT INTO tipo_categoria (id_usuario, nombre) VALUES 
(NULL, 'Alimento'),
(NULL, 'Hogar'),
(NULL, 'Personal'),
(NULL, 'Electrónica'),
(NULL, 'Ropa');

-- Insertar categorías (suponiendo que los ids de tipo_categoria sean 1, 2, 3, 4 y 5)
INSERT INTO categoria (id_tipo, id_usuario, nombre) VALUES 
(1, NULL, 'Lácteos'),
(1, NULL, 'Granos'),
(1, NULL, 'Mascotas'),
(2, NULL, 'Limpieza'),
(3, NULL, 'Higiene'),
(4, NULL, 'Computadoras'),
(4, NULL, 'Telefonía'),
(4, NULL, 'Audio'),
(4, NULL, 'Video'),
(4, NULL, 'Accesorios'),
(5, NULL, 'Camisas'),
(5, NULL, 'Pantalones'),
(5, NULL, 'Zapatos'),
(5, NULL, 'Abrigos'),
(5, NULL, 'Accesorios');

-- Insertar productos (suponiendo que los ids de categoria sean 1 a 15 y que id_unidad_medida sea 1 para kg, 2 para unidades, 3 para litros y 5 para mililitros)
INSERT INTO producto (id_usuario, id_categoria, nombre, descripcion, cantidad_stock, cantidad_min_mensual, favorito, id_unidad_medida) VALUES 
(NULL, 1, 'Leche', 'Leche entera 1L', 0, 0, FALSE, 3), -- id_unidad_medida 3 para litros
(NULL, 4, 'Detergente', 'Detergente para ropa 1kg', 0, 0, FALSE, 1), -- id_unidad_medida 1 para kg
(NULL, 5, 'Shampoo', 'Shampoo anticaspa 500ml', 0, 0, FALSE, 5), -- id_unidad_medida 5 para mililitros
(NULL, 2, 'Arroz', 'Arroz blanco 1kg', 0, 0, FALSE, 1), -- id_unidad_medida 1 para kg
(NULL, 3, 'Croquetas', 'Croquetas para perro 5kg', 0, 0, FALSE, 1), -- id_unidad_medida 1 para kg
(NULL, 6, 'Laptop', 'Laptop 15 pulgadas', 0, 0, FALSE, 2), -- id_unidad_medida 2 para unidades
(NULL, 7, 'Smartphone', 'Smartphone última generación', 0, 0, FALSE, 2), -- id_unidad_medida 2 para unidades
(NULL, 8, 'Audífonos', 'Audífonos Bluetooth', 0, 0, FALSE, 2), -- id_unidad_medida 2 para unidades
(NULL, 9, 'Televisor', 'Televisor 55 pulgadas 4K', 0, 0, FALSE, 2), -- id_unidad_medida 2 para unidades
(NULL, 10, 'Cargador', 'Cargador USB-C', 0, 0, FALSE, 2), -- id_unidad_medida 2 para unidades
(NULL, 11, 'Camisa Blanca', 'Camisa de algodón blanca', 0, 0, FALSE, 2), -- id_unidad_medida 2 para unidades
(NULL, 12, 'Jeans', 'Jeans azules de mezclilla', 0, 0, FALSE, 2), -- id_unidad_medida 2 para unidades
(NULL, 13, 'Zapatos Deportivos', 'Zapatos deportivos talla 42', 0, 0, FALSE, 2), -- id_unidad_medida 2 para unidades
(NULL, 14, 'Abrigo', 'Abrigo de invierno', 0, 0, FALSE, 2), -- id_unidad_medida 2 para unidades
(NULL, 15, 'Bufanda', 'Bufanda de lana', 0, 0, FALSE, 2); -- id_unidad_medida 2 para unidades



--Resumen de Datos Insertados
--Tipos de Categoría
Alimento
Hogar
Personal
Electrónica
Ropa

--Categorías
Lácteos (Tipo: Alimento)
Granos (Tipo: Alimento)
Mascotas (Tipo: Alimento)
Limpieza (Tipo: Hogar)
Higiene (Tipo: Personal)
Computadoras (Tipo: Electrónica)
Telefonía (Tipo: Electrónica)
Audio (Tipo: Electrónica)
Video (Tipo: Electrónica)
Accesorios (Tipo: Electrónica)
Camisas (Tipo: Ropa)
Pantalones (Tipo: Ropa)
Zapatos (Tipo: Ropa)
Abrigos (Tipo: Ropa)
Accesorios (Tipo: Ropa)

--Productos
Leche
Categoría: Lácteos
Descripción: Leche entera 1L
Cantidad Stock: 10
Cantidad Min Mensual: 5
Unidad Medida: Litros

Detergente
Categoría: Limpieza
Descripción: Detergente para ropa 1kg
Cantidad Stock: 20
Cantidad Min Mensual: 10
Unidad Medida: Kilos

Shampoo
Categoría: Higiene
Descripción: Shampoo anticaspa 500ml
Cantidad Stock: 15
Cantidad Min Mensual: 7
Unidad Medida: Mililitros

Arroz
Categoría: Granos
Descripción: Arroz blanco 1kg
Cantidad Stock: 25
Cantidad Min Mensual: 10
Unidad Medida: Kilos

Croquetas
Categoría: Mascotas
Descripción: Croquetas para perro 5kg
Cantidad Stock: 30
Cantidad Min Mensual: 15
Unidad Medida: Kilos

Laptop
Categoría: Computadoras
Descripción: Laptop 15 pulgadas
Cantidad Stock: 5
Cantidad Min Mensual: 2
Unidad Medida: Unidades

Smartphone
Categoría: Telefonía
Descripción: Smartphone última generación
Cantidad Stock: 10
Cantidad Min Mensual: 5
Unidad Medida: Unidades

Audífonos
Categoría: Audio
Descripción: Audífonos Bluetooth
Cantidad Stock: 15
Cantidad Min Mensual: 7
Unidad Medida: Unidades

Televisor
Categoría: Video
Descripción: Televisor 55 pulgadas 4K
Cantidad Stock: 3
Cantidad Min Mensual: 1
Unidad Medida: Unidades

Cargador
Categoría: Accesorios (Electrónica)
Descripción: Cargador USB-C
Cantidad Stock: 25
Cantidad Min Mensual: 10
Unidad Medida: Unidades

Camisa Blanca
Categoría: Camisas
Descripción: Camisa de algodón blanca
Cantidad Stock: 20
Cantidad Min Mensual: 10
Unidad Medida: Unidades

Jeans
Categoría: Pantalones
Descripción: Jeans azules de mezclilla
Cantidad Stock: 30
Cantidad Min Mensual: 15
Unidad Medida: Unidades

Zapatos Deportivos
Categoría: Zapatos
Descripción: Zapatos deportivos talla 42
Cantidad Stock: 10
Cantidad Min Mensual: 5
Unidad Medida: Unidades

Abrigo
Categoría: Abrigos
Descripción: Abrigo de invierno
Cantidad Stock: 8
Cantidad Min Mensual: 4
Unidad Medida: Unidades

Bufanda
Categoría: Accesorios (Ropa)
Descripción: Bufanda de lana
Cantidad Stock: 12
Cantidad Min Mensual: 6
Unidad Medida: Unidades

--Resumen de Asociaciones
--Tipos de Categoría a Categorías:
Alimento: Lácteos, Granos, Mascotas
Hogar: Limpieza
Personal: Higiene
Electrónica: Computadoras, Telefonía, Audio, Video, Accesorios
Ropa: Camisas, Pantalones, Zapatos, Abrigos, Accesorios

--Categorías a Productos:
Lácteos: Leche
Limpieza: Detergente
Higiene: Shampoo
Granos: Arroz
Mascotas: Croquetas
Computadoras: Laptop
Telefonía: Smartphone
Audio: Audífonos
Video: Televisor
Accesorios (Electrónica): Cargador
Camisas: Camisa Blanca
Pantalones: Jeans
Zapatos: Zapatos Deportivos
Abrigos: Abrigo
Accesorios (Ropa): Bufanda



Kilos (kg): 0.01 - 1000 kg (para cubrir desde pequeñas cantidades hasta grandes volúmenes).
Unidades (unid): 1 - 10000 (considerando productos que se venden en unidades).
Litros (l): 0.01 - 1000 l (desde pequeñas botellas hasta grandes contenedores).
Gramos (g): 0.1 - 100000 g (desde pequeñas cantidades hasta sacos grandes).
Mililitros (ml): 1 - 100000 ml (desde pequeños envases hasta grandes volúmenes).
Piezas (pcs): 1 - 10000 pcs (similares a unidades).
Paquetes (pkg): 1 - 1000 pkg (paquetes de diferentes tamaños).
Metros (m): 0.1 - 1000 m (desde piezas pequeñas hasta grandes rollos).
Centímetros (cm): 1 - 10000 cm (similares a metros pero para detalles más finos).
Docenas (doc): 1 - 1000 doc (para productos vendidos en docenas).
Libras (lb): 0.01 - 2000 lb (similares a kilos, pero en sistema imperial).
Onzas (oz): 0.1 - 50000 oz (desde pequeñas cantidades hasta grandes volúmenes).
Cajas (cjs): 1 - 1000 cjs (para empaques grandes).
Bolsas (bg): 1 - 1000 bg (para empaques de diferentes tamaños).
Tarros (jar): 1 - 1000 jar (para productos envasados en tarros).
Botellas (btl): 1 - 10000 btl (para productos líquidos embotellados).
Sobres (sbr): 1 - 10000 sbr (para productos pequeños empaquetados en sobres).
Rollos (rl): 1 - 1000 rl (para productos en rollos, como papel o tela).