CREATE DATABASE IF NOT EXISTS tmu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tmu;
SET NAMES utf8mb4;

CREATE TABLE user (
  user_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NOT NULL,
  last_name1 VARCHAR(45) NOT NULL,
  last_name2 VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE INDEX email_UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admin (
  admin_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  access_level INT NOT NULL,
  PRIMARY KEY (admin_id),
  UNIQUE INDEX user_id_UNIQUE (user_id),
  CONSTRAINT fk_admin_user FOREIGN KEY (user_id)
    REFERENCES user (user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE teacher (
  teacher_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  PRIMARY KEY (teacher_id),
  UNIQUE INDEX user_id_UNIQUE (user_id),
  CONSTRAINT fk_teacher_user FOREIGN KEY (user_id)
    REFERENCES user (user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE student (
  student_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  PRIMARY KEY (student_id),
  UNIQUE INDEX user_id_UNIQUE (user_id),
  CONSTRAINT fk_student_user FOREIGN KEY (user_id)
    REFERENCES user (user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE parent (
  parent_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  student_id INT NOT NULL,
  PRIMARY KEY (parent_id),
  INDEX student_id_idx (student_id),
  CONSTRAINT fk_parent_user FOREIGN KEY (user_id)
    REFERENCES user (user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_parent_student FOREIGN KEY (student_id)
    REFERENCES student (student_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE message (
  message_id INT NOT NULL AUTO_INCREMENT,
  author_user_id INT NOT NULL,
  recipient_user_id INT NOT NULL,
  date DATETIME NOT NULL,
  content VARCHAR(255) NOT NULL,
  PRIMARY KEY (message_id),
  INDEX fk_message_author_idx (author_user_id),
  INDEX fk_message_recipient_idx (recipient_user_id),
  CONSTRAINT fk_message_author FOREIGN KEY (author_user_id)
    REFERENCES user (user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_message_recipient FOREIGN KEY (recipient_user_id)
    REFERENCES user (user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE course (
  course_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  start_year YEAR NOT NULL,
  end_year YEAR NOT NULL,
  PRIMARY KEY (course_id),
  UNIQUE INDEX unique_name_start_end (name, start_year, end_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE subject (
  subject_id INT NOT NULL AUTO_INCREMENT,
  course_id INT NOT NULL,
  name VARCHAR(45) NOT NULL,
  class_group VARCHAR(45) NOT NULL,
  teacher_id INT NOT NULL,
  PRIMARY KEY (subject_id),
  INDEX fk_subject_course_idx (course_id),
  UNIQUE INDEX unique_course_name_group (course_id, name, class_group),
  INDEX fk_subject_teacher_idx (teacher_id),
  CONSTRAINT fk_subject_course FOREIGN KEY (course_id)
    REFERENCES course (course_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_subject_teacher FOREIGN KEY (teacher_id)
    REFERENCES teacher (teacher_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE student_subject (
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  PRIMARY KEY (student_id, subject_id),
  INDEX fk_student_subject_subject_idx (subject_id),
  CONSTRAINT fk_student_subject_subject FOREIGN KEY (subject_id)
    REFERENCES subject (subject_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_student_subject_student FOREIGN KEY (student_id)
    REFERENCES student (student_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE schedule (
  schedule_id INT NOT NULL AUTO_INCREMENT,
  subject_id INT NOT NULL,
  weekday ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  PRIMARY KEY (schedule_id),
  INDEX fk_schedule_subject_idx (subject_id),
  CONSTRAINT fk_schedule_subject FOREIGN KEY (subject_id)
    REFERENCES subject (subject_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bulletin_board_entry (
  entry_id INT NOT NULL AUTO_INCREMENT,
  subject_id INT NOT NULL,
  content VARCHAR(255) NOT NULL,
  attachment_url VARCHAR(255) NULL,
  title VARCHAR(45) NOT NULL,
  PRIMARY KEY (entry_id),
  INDEX fk_entry_subject_idx (subject_id),
  CONSTRAINT fk_entry_subject FOREIGN KEY (subject_id)
    REFERENCES subject (subject_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE activity (
  activity_id INT NOT NULL AUTO_INCREMENT,
  subject_id INT NOT NULL,
  title VARCHAR(45) NOT NULL,
  content VARCHAR(255) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  type ENUM('exam', 'assignment') NOT NULL,
  PRIMARY KEY (activity_id),
  INDEX fk_activity_subject_idx (subject_id),
  CONSTRAINT fk_activity_subject FOREIGN KEY (subject_id)
    REFERENCES subject (subject_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE submission (
  submission_id INT NOT NULL AUTO_INCREMENT,
  student_id INT NOT NULL,
  activity_id INT NOT NULL,
  grade FLOAT NULL,
  content VARCHAR(255) NOT NULL,
  student_comment VARCHAR(255) NULL,
  teacher_comment VARCHAR(255) NULL,
  submission_date DATETIME NULL,
  status ENUM('pending', 'in_progress', 'completed') NOT NULL,
  start_date DATETIME NOT NULL,
  PRIMARY KEY (submission_id),
  INDEX fk_submission_student_idx (student_id),
  INDEX fk_submission_activity_idx (activity_id),
  CONSTRAINT fk_submission_student FOREIGN KEY (student_id)
    REFERENCES student (student_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_submission_activity FOREIGN KEY (activity_id)
    REFERENCES activity (activity_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO user (first_name, last_name1, last_name2, email, password) VALUES
('Ana', 'García', 'López', 'ana.garcia@example.com', 'pass123'),
('Luis', 'Pérez', 'Martínez', 'luis.perez@example.com', 'pass123'),
('Marta', 'Sánchez', 'Ruiz', 'marta.sanchez@example.com', 'pass123'),
('Carlos', 'Ramírez', 'Núñez', 'carlos.ramirez@example.com', 'pass123'),
('Lucía', 'Torres', 'Díaz', 'lucia.torres@example.com', 'pass123'),
('Pedro', 'Gómez', 'Ortiz', 'pedro.gomez@example.com', 'pass123'),
('Sara', 'Molina', 'Vega', 'sara.molina@example.com', 'pass123'),
('Elena', 'Hernández', 'Soto', 'elena.hernandez@example.com', 'pass123'),
('David', 'Navarro', 'Cano', 'david.navarro@example.com', 'pass123'),
('María', 'Castro', 'Rojas', 'maria.castro@example.com', 'pass123'),
('Jorge', 'Ortega', 'Silva', 'jorge.ortega@example.com', 'pass123'),
('Raquel', 'Delgado', 'Marín', 'raquel.delgado@example.com', 'pass123'),
('Pablo', 'Reyes', 'Ibáñez', 'pablo.reyes@example.com', 'pass123'),
('Inés', 'Guerrero', 'Blanco', 'ines.guerrero@example.com', 'pass123'),
('Francisco', 'Moreno', 'Peña', 'francisco.moreno@example.com', 'pass123'),
('Laura', 'Camacho', 'Romero', 'laura.camacho@example.com', 'pass123'),
('Hugo', 'Serrano', 'Giménez', 'hugo.serrano@example.com', 'pass123'),
('Carmen', 'Lara', 'Redondo', 'carmen.lara@example.com', 'pass123'),
('Ismael', 'Rivas', 'Gallego', 'ismael.rivas@example.com', 'pass123'),
('Alba', 'Ibáñez', 'Cruz', 'alba.ibanez@example.com', 'pass123'),
('Roberto', 'Estevez', 'Medina', 'roberto.estevez@example.com', 'pass123'),
('Paula', 'Nieves', 'Barroso', 'paula.nieves@example.com', 'pass123'),
('Gustavo', 'Roldán', 'Acosta', 'gustavo.roldan@example.com', 'pass123'),
('Silvia', 'Rosales', 'Perales', 'silvia.rosales@example.com', 'pass123'),
('Miguel', 'Carrillo', 'Crespo', 'miguel.carrillo@example.com', 'pass123');

INSERT INTO admin (user_id, access_level) VALUES
(1, 5),
(8, 4),
(24, 5);

INSERT INTO teacher (user_id) VALUES
(2),
(3),
(9),
(13),
(16),
(19),
(23),
(25);

INSERT INTO student (user_id) VALUES
(4),
(5),
(10),
(12),
(15),
(17),
(20),
(22);

INSERT INTO parent (user_id, student_id) VALUES
(6, 1),
(7, 2),
(11, 3),
(14, 4),
(18, 5),
(21, 6);

INSERT INTO course (name, start_year, end_year) VALUES
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

INSERT INTO message (author_user_id, recipient_user_id, date, content) VALUES
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

INSERT INTO subject (course_id, name, class_group, teacher_id) VALUES
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
