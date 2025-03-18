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
