CREATE DATABASE IF NOT EXISTS tmu CHARACTER SET utf8mb4;
USE tmu;

CREATE TABLE rol (
  id_rol INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_rol),
  UNIQUE INDEX nombre_UNIQUE (nombre)
);

CREATE TABLE usuario (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  apellido_1 VARCHAR(45) NOT NULL,
  apellido_2 VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  id_rol INT NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE INDEX email_UNIQUE (email),
  INDEX id_rol_idx (id_rol),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol)
    REFERENCES rol (id_rol)
    ON DELETE CASCADE
);

CREATE TABLE admin (
  id_admin INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  nivel_acceso INT NOT NULL,
  PRIMARY KEY (id_admin),
  UNIQUE INDEX id_usuario_UNIQUE (id_usuario),
  CONSTRAINT fk_admin_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
    ON DELETE CASCADE
);

CREATE TABLE docente (
  id_docente INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_docente),
  UNIQUE INDEX id_usuario_UNIQUE (id_usuario),
  CONSTRAINT fk_docente_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
    ON DELETE CASCADE
);

CREATE TABLE estudiante (
  id_estudiante INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_estudiante),
  UNIQUE INDEX id_usuario_UNIQUE (id_usuario),
  CONSTRAINT fk_estudiante_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
    ON DELETE CASCADE
);

CREATE TABLE padre (
  id_padre INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_estudiante INT NOT NULL,
  PRIMARY KEY (id_padre),
  INDEX id_estudiante_idx (id_estudiante),
  CONSTRAINT fk_padre_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
    ON DELETE CASCADE,
  CONSTRAINT fk_padre_estudiante FOREIGN KEY (id_estudiante)
    REFERENCES estudiante (id_estudiante)
    ON DELETE CASCADE
);

CREATE TABLE mensaje (
  id_mensaje INT NOT NULL AUTO_INCREMENT,
  id_usuario_autor INT NOT NULL,
  id_usuario_receptor INT NOT NULL,
  fecha DATETIME NOT NULL,
  contenido VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_mensaje),
  INDEX fk_mensaje_autor_idx (id_usuario_autor),
  INDEX fk_mensaje_receptor_idx (id_usuario_receptor),
  CONSTRAINT fk_mensaje_autor FOREIGN KEY (id_usuario_autor)
    REFERENCES usuario (id_usuario)
    ON DELETE CASCADE,
  CONSTRAINT fk_mensaje_receptor FOREIGN KEY (id_usuario_receptor)
    REFERENCES usuario (id_usuario)
    ON DELETE CASCADE
);

CREATE TABLE curso (
  id_curso INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  inicio YEAR NOT NULL,
  fin YEAR NOT NULL,
  PRIMARY KEY (id_curso),
  UNIQUE INDEX unique_nombre_inicio_fin (nombre, inicio, fin)
);

CREATE TABLE asignatura (
  id_asignatura INT NOT NULL AUTO_INCREMENT,
  id_curso INT NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  grupo VARCHAR(45) NOT NULL,
  id_docente INT NOT NULL,
  PRIMARY KEY (id_asignatura),
  INDEX fk_asignatura_curso_idx (id_curso),
  UNIQUE INDEX unique_curso_nombre_grupo (id_curso, nombre, grupo),
  INDEX fk_asignatura_docente_idx (id_docente),
  CONSTRAINT fk_asignatura_curso FOREIGN KEY (id_curso)
    REFERENCES curso (id_curso)
    ON DELETE CASCADE,
  CONSTRAINT fk_asignatura_docente FOREIGN KEY (id_docente)
    REFERENCES docente (id_docente)
    ON DELETE CASCADE
);

CREATE TABLE estudiante_asignatura (
  id_estudiante INT NOT NULL,
  id_asignatura INT NOT NULL,
  PRIMARY KEY (id_estudiante, id_asignatura),
  INDEX fk_estudiante_asignatura_asignatura_idx (id_asignatura),
  CONSTRAINT fk_estudiante_asignatura_asignatura FOREIGN KEY (id_asignatura)
    REFERENCES asignatura (id_asignatura)
    ON DELETE CASCADE,
  CONSTRAINT fk_estudiante_asignatura_estudiante FOREIGN KEY (id_estudiante)
    REFERENCES estudiante (id_estudiante)
    ON DELETE CASCADE
);

CREATE TABLE horario (
  id_horario INT NOT NULL AUTO_INCREMENT,
  id_asignatura INT NOT NULL,
  dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  PRIMARY KEY (id_horario),
  INDEX fk_horario_asignatura_idx (id_asignatura),
  CONSTRAINT fk_horario_asignatura FOREIGN KEY (id_asignatura)
    REFERENCES asignatura (id_asignatura)
    ON DELETE CASCADE
);

CREATE TABLE entrada_tablon_anuncios (
  id_entrada INT NOT NULL AUTO_INCREMENT,
  id_asignatura INT NOT NULL,
  contenido VARCHAR(255) NOT NULL,
  url_archivo_adjunto VARCHAR(255) NULL,
  titulo VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_entrada),
  INDEX fk_entrada_asignatura_idx (id_asignatura),
  CONSTRAINT fk_entrada_asignatura FOREIGN KEY (id_asignatura)
    REFERENCES asignatura (id_asignatura)
    ON DELETE CASCADE
);

CREATE TABLE actividad (
  id_actividad INT NOT NULL AUTO_INCREMENT,
  id_asignatura INT NOT NULL,
  titulo VARCHAR(45) NOT NULL,
  contenido VARCHAR(255) NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NOT NULL,
  tipo ENUM('examen', 'tarea') NOT NULL,
  PRIMARY KEY (id_actividad),
  INDEX fk_actividad_asignatura_idx (id_asignatura),
  CONSTRAINT fk_actividad_asignatura FOREIGN KEY (id_asignatura)
    REFERENCES asignatura (id_asignatura)
    ON DELETE CASCADE
);

CREATE TABLE entrega (
  id_entrega INT NOT NULL AUTO_INCREMENT,
  id_estudiante INT NOT NULL,
  id_actividad INT NOT NULL,
  calificacion FLOAT NULL,
  contenido VARCHAR(255) NOT NULL,
  comentario_estudiante VARCHAR(255) NULL,
  comentario_docente VARCHAR(255) NULL,
  fecha_entrega DATETIME NULL,
  estado ENUM('pendiente', 'progreso', 'finalizada') NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  PRIMARY KEY (id_entrega),
  INDEX fk_entrega_estudiante_idx (id_estudiante),
  INDEX fk_entrega_actividad_idx (id_actividad),
  CONSTRAINT fk_entrega_estudiante FOREIGN KEY (id_estudiante)
    REFERENCES estudiante (id_estudiante)
    ON DELETE CASCADE,
  CONSTRAINT fk_entrega_actividad FOREIGN KEY (id_actividad)
    REFERENCES actividad (id_actividad)
    ON DELETE CASCADE
);

INSERT INTO rol (nombre) VALUES
('admin'),
('docente'),
('estudiante'),
('padre'),
('invitado'),
('coordinador'),
('supervisor'),
('director'),
('asistente'),
('psicologo'),
('secretaria'),
('bibliotecario'),
('orientador'),
('enfermero'),
('conserje'),
('tecnico'),
('contador'),
('seguridad'),
('jefe de estudios'),
('subdirector'),
('tutor'),
('monitor'),
('becario'),
('visitante'),
('egresado');

INSERT INTO usuario (nombre, apellido_1, apellido_2, email, id_rol, password) VALUES
('Ana', 'García', 'López', 'ana.garcia@example.com', 1, 'pass123'),
('Luis', 'Pérez', 'Martínez', 'luis.perez@example.com', 2, 'pass123'),
('Marta', 'Sánchez', 'Ruiz', 'marta.sanchez@example.com', 2, 'pass123'),
('Carlos', 'Ramírez', 'Núñez', 'carlos.ramirez@example.com', 3, 'pass123'),
('Lucía', 'Torres', 'Díaz', 'lucia.torres@example.com', 3, 'pass123'),
('Pedro', 'Gómez', 'Ortiz', 'pedro.gomez@example.com', 4, 'pass123'),
('Sara', 'Molina', 'Vega', 'sara.molina@example.com', 4, 'pass123'),
('Elena', 'Hernández', 'Soto', 'elena.hernandez@example.com', 1, 'pass123'),
('David', 'Navarro', 'Cano', 'david.navarro@example.com', 2, 'pass123'),
('María', 'Castro', 'Rojas', 'maria.castro@example.com', 3, 'pass123'),
('Jorge', 'Ortega', 'Silva', 'jorge.ortega@example.com', 4, 'pass123'),
('Raquel', 'Delgado', 'Marín', 'raquel.delgado@example.com', 3, 'pass123'),
('Pablo', 'Reyes', 'Ibáñez', 'pablo.reyes@example.com', 2, 'pass123'),
('Inés', 'Guerrero', 'Blanco', 'ines.guerrero@example.com', 4, 'pass123'),
('Francisco', 'Moreno', 'Peña', 'francisco.moreno@example.com', 3, 'pass123'),
('Laura', 'Camacho', 'Romero', 'laura.camacho@example.com', 2, 'pass123'),
('Hugo', 'Serrano', 'Giménez', 'hugo.serrano@example.com', 3, 'pass123'),
('Carmen', 'Lara', 'Redondo', 'carmen.lara@example.com', 4, 'pass123'),
('Ismael', 'Rivas', 'Gallego', 'ismael.rivas@example.com', 2, 'pass123'),
('Alba', 'Ibáñez', 'Cruz', 'alba.ibanez@example.com', 3, 'pass123'),
('Roberto', 'Estevez', 'Medina', 'roberto.estevez@example.com', 4, 'pass123'),
('Paula', 'Nieves', 'Barroso', 'paula.nieves@example.com', 3, 'pass123'),
('Gustavo', 'Roldán', 'Acosta', 'gustavo.roldan@example.com', 2, 'pass123'),
('Silvia', 'Rosales', 'Perales', 'silvia.rosales@example.com', 1, 'pass123'),
('Miguel', 'Carrillo', 'Crespo', 'miguel.carrillo@example.com', 2, 'pass123');

INSERT INTO admin (id_usuario, nivel_acceso) VALUES
(1, 5),
(8, 4),
(24, 5);

INSERT INTO docente (id_usuario) VALUES
(2),
(3),
(9),
(13),
(16),
(19),
(23),
(25);

INSERT INTO estudiante (id_usuario) VALUES
(4),
(5),
(10),
(12),
(15),
(17),
(20),
(22);

INSERT INTO padre (id_usuario, id_estudiante) VALUES
(6, 1),
(7, 2),
(11, 3),
(14, 4),
(18, 5),
(21, 6);

INSERT INTO curso (nombre, inicio, fin) VALUES
('Primero Básico', 2023, 2024),
('Segundo Básico', 2023, 2024),
('Tercero Básico', 2023, 2024),
('Cuarto Básico', 2023, 2024),
('Quinto Básico', 2023, 2024),
('Sexto Básico', 2023, 2024),
('Séptimo Básico', 2023, 2024),
('Octavo Básico', 2023, 2024),
('Primero Medio', 2023, 2024),
('Segundo Medio', 2023, 2024),
('Tercero Medio', 2023, 2024),
('Cuarto Medio', 2023, 2024),
('Prekinder', 2023, 2024),
('Kinder', 2023, 2024),
('1° Ciclo', 2023, 2024),
('2° Ciclo', 2023, 2024),
('Educación Especial', 2023, 2024),
('Básica Modular', 2023, 2024),
('Media Modular', 2023, 2024),
('Electivo Ciencias', 2023, 2024),
('Electivo Humanista', 2023, 2024),
('Tecnología', 2023, 2024),
('Artes', 2023, 2024),
('Música', 2023, 2024),
('Educación Física', 2023, 2024);

INSERT INTO mensaje (id_usuario_autor, id_usuario_receptor, fecha, contenido) VALUES
(1, 2, NOW(), 'Bienvenido al sistema'),
(2, 4, NOW(), 'Consulta sobre tarea'),
(3, 5, NOW(), 'Revisar el horario'),
(4, 2, NOW(), 'Tarea enviada'),
(5, 6, NOW(), 'Consulta calificación'),
(6, 10, NOW(), 'Reunión de padres'),
(10, 2, NOW(), 'Gracias por la clase'),
(8, 13, NOW(), 'Informe de actividad'),
(13, 4, NOW(), 'Revisión del examen'),
(16, 20, NOW(), 'Tienes una nueva entrega'),
(2, 5, NOW(), 'Mensaje interno'),
(3, 12, NOW(), 'Trabajo pendiente'),
(9, 1, NOW(), 'Reporte semanal'),
(2, 17, NOW(), 'No has entregado'),
(20, 2, NOW(), 'Ya entregué'),
(22, 13, NOW(), '¿Puedo repetir la tarea?'),
(25, 12, NOW(), 'Falta tarea de ayer'),
(13, 4, NOW(), 'Gracias por entregar'),
(15, 19, NOW(), 'Actividad reabierta'),
(3, 15, NOW(), 'Envío notas'),
(4, 2, NOW(), 'Gracias por responder'),
(2, 14, NOW(), 'Anuncio importante'),
(1, 10, NOW(), 'Cambio de fecha de entrega'),
(8, 17, NOW(), 'Nueva tarea subida'),
(3, 11, NOW(), 'Aviso para padres');

INSERT INTO asignatura (id_curso, nombre, grupo, id_docente) VALUES
(1, 'Matemáticas', 'A', 1),
(1, 'Lenguaje', 'A', 2),
(2, 'Ciencias', 'A', 3),
(2, 'Historia', 'A', 4),
(3, 'Inglés', 'B', 5),
(3, 'Educación Física', 'B', 6),
(4, 'Artes', 'B', 7),
(4, 'Tecnología', 'B', 8),
(5, 'Matemáticas', 'A', 1),
(6, 'Lenguaje', 'A', 2),
(7, 'Ciencias', 'A', 3),
(8, 'Historia', 'A', 4),
(9, 'Inglés', 'B', 5),
(10, 'Educación Física', 'B', 6),
(11, 'Artes', 'B', 7),
(12, 'Tecnología', 'B', 8),
(13, 'Matemáticas', 'A', 1),
(14, 'Lenguaje', 'A', 2),
(15, 'Ciencias', 'A', 3),
(16, 'Historia', 'A', 4),
(17, 'Inglés', 'B', 5),
(18, 'Educación Física', 'B', 6),
(19, 'Artes', 'B', 7),
(20, 'Tecnología', 'B', 8),
(21, 'Física', 'A', 1);