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
  weekday ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes') NOT NULL,
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
('Ana', 'García', 'López', 'ana.garcia@example.com', 'pass123'), -- Admin
('Luis', 'Pérez', 'Martínez', 'luis.perez@example.com', 'pass123'), -- Profe
('Marta', 'Sánchez', 'Ruiz', 'marta.sanchez@example.com', 'pass123'), -- Profe
('Carlos', 'Ramírez', 'Núñez', 'carlos.ramirez@example.com', 'pass123'), -- Alumno
('Lucía', 'Torres', 'Díaz', 'lucia.torres@example.com', 'pass123'), -- Alumno
('Pedro', 'Gómez', 'Ortiz', 'pedro.gomez@example.com', 'pass123'), -- Padre
('Sara', 'Molina', 'Vega', 'sara.molina@example.com', 'pass123'), -- Padre
('Elena', 'Hernández', 'Soto', 'elena.hernandez@example.com', 'pass123'), -- Admin
('David', 'Navarro', 'Cano', 'david.navarro@example.com', 'pass123'), -- Profe
('María', 'Castro', 'Rojas', 'maria.castro@example.com', 'pass123'), -- Alumno
('Jorge', 'Ortega', 'Silva', 'jorge.ortega@example.com', 'pass123'), -- Padre
('Raquel', 'Delgado', 'Marín', 'raquel.delgado@example.com', 'pass123'), -- Alumno
('Pablo', 'Reyes', 'Ibáñez', 'pablo.reyes@example.com', 'pass123'), -- Profe
('Inés', 'Guerrero', 'Blanco', 'ines.guerrero@example.com', 'pass123'), -- Padre
('Francisco', 'Moreno', 'Peña', 'francisco.moreno@example.com', 'pass123'), -- Alumno
('Laura', 'Camacho', 'Romero', 'laura.camacho@example.com', 'pass123'), -- Profe
('Hugo', 'Serrano', 'Giménez', 'hugo.serrano@example.com', 'pass123'), -- Alumno
('Carmen', 'Lara', 'Redondo', 'carmen.lara@example.com', 'pass123'), -- Padre
('Ismael', 'Rivas', 'Gallego', 'ismael.rivas@example.com', 'pass123'), -- Profe
('Alba', 'Ibáñez', 'Cruz', 'alba.ibanez@example.com', 'pass123'), -- Alumno
('Roberto', 'Estevez', 'Medina', 'roberto.estevez@example.com', 'pass123'), -- Padre
('Paula', 'Nieves', 'Barroso', 'paula.nieves@example.com', 'pass123'), -- Alumno
('Gustavo', 'Roldán', 'Acosta', 'gustavo.roldan@example.com', 'pass123'), -- Profe
('Silvia', 'Rosales', 'Perales', 'silvia.rosales@example.com', 'pass123'), -- Admin
('Miguel', 'Carrillo', 'Crespo', 'miguel.carrillo@example.com', 'pass123'), -- Profe
('Sofía', 'Mendoza', 'Vargas', 'sofia.mendoza@example.com', 'pass123'),
('Ricardo', 'Mendoza', 'Silva', 'ricardo.mendoza@example.com', 'pass123');

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
(22),
(26);

INSERT INTO parent (user_id, student_id) VALUES
(6, 1),
(7, 2),
(11, 3),
(14, 4),
(18, 5),
(21, 6),
(27, 9);

INSERT INTO course (name, start_year, end_year) VALUES
('1º ESO', 2023, 2024),
('2º ESO', 2024, 2025),
('3º ESO', 2025, 2026),
('4º ESO', 2026, 2027);

INSERT INTO message (author_user_id, recipient_user_id, date, content) VALUES
(16, 4, '2025-03-26 03:12:41', '¿Vamos a repasar antes del examen?'),
(4, 16, '2025-03-21 06:42:41', 'Buena idea, ¿a qué hora?'),
(16, 4, '2025-04-06 12:39:41', 'Después del almuerzo'),
(24, 11, '2025-04-08 22:29:41', '¿Quieres practicar juntos para la presentación?'),
(11, 24, '2025-04-06 15:45:41', 'Sí, podemos ir a la biblioteca'),
(24, 11, '2025-03-22 20:07:41', 'Perfecto, llevo el portátil'),
(8, 15, '2025-04-08 01:51:41', '¿Quieres practicar juntos para la presentación?'),
(15, 8, '2025-03-30 15:36:41', 'Sí, podemos ir a la biblioteca'),
(8, 15, '2025-04-01 04:22:41', 'Perfecto, llevo el portátil'),
(18, 6, '2025-03-16 08:07:41', '¿Quieres practicar juntos para la presentación?'),
(6, 18, '2025-03-16 09:41:41', 'Sí, podemos ir a la biblioteca'),
(18, 6, '2025-03-16 09:43:41', 'Perfecto, llevo el portátil'),
(3, 9, '2025-04-07 15:12:41', '¿Estás en clase hoy?'),
(9, 3, '2025-03-29 05:30:41', 'Sí, pero llego tarde'),
(3, 9, '2025-04-03 00:55:41', 'Vale, guardo sitio'),
(6, 4, '2025-03-22 06:40:41', '¿Tienes los apuntes de la clase de historia?'),
(4, 6, '2025-03-30 02:21:41', 'Sí, te los paso por correo'),
(6, 4, '2025-04-12 14:52:41', 'Genial, gracias'),
(4, 6, '2025-03-30 02:21:41', 'Ya te lo he mandado'),
(17, 12, '2025-03-29 03:33:41', '¿Sabes cuándo es la reunión de padres?'),
(12, 17, '2025-03-20 07:57:41', 'Creo que el jueves'),
(17, 12, '2025-03-16 04:46:41', 'Gracias, le aviso a mi madre'),
(6, 7, '2025-04-03 14:22:41', '¿Puedes revisar mi código?'),
(7, 6, '2025-04-03 16:48:41', 'Claro, mándamelo'),
(6, 7, '2025-04-03 17:00:03', 'Hecho, gracias'),
(14, 9, '2025-03-21 09:18:41', '¿Tienes los apuntes de la clase de historia?'),
(9, 14, '2025-03-21 10:03:41', 'Sí, te los paso por correo'),
(14, 9, '2025-03-21 10:15:41', '¡Gracias, crack!'),
(19, 7, '2025-04-01 11:25:41', '¿Revisaste la entrega de ayer?'),
(7, 19, '2025-04-01 12:01:41', 'Sí, está todo bien'),
(19, 7, '2025-04-01 12:05:41', 'Genial, gracias'),
(5, 20, '2025-04-03 15:40:41', '¿Quieres hacer el trabajo en grupo?'),
(20, 5, '2025-04-03 16:02:41', 'Sí, mejor que solo'),
(5, 20, '2025-04-03 16:08:41', 'Vale, nos juntamos mañana'),
(11, 18, '2025-04-04 17:30:41', '¿Has visto el nuevo horario?'),
(18, 11, '2025-04-04 17:50:41', 'Sí, cambia tecnología a los lunes'),
(11, 18, '2025-04-04 18:00:41', 'Menos mal, los viernes eran malos'),
(22, 13, '2025-03-28 08:44:41', '¿Qué día era la salida escolar?'),
(13, 22, '2025-03-28 09:00:41', 'El martes que viene'),
(22, 13, '2025-03-28 09:03:41', 'Perfecto, gracias'),
(6, 2, '2025-03-30 13:13:41', '¿Tienes tiempo para repasar mates?'),
(2, 6, '2025-03-30 13:40:41', 'Sí, a las 6 en la sala 3'),
(6, 2, '2025-03-30 13:44:41', 'Nos vemos allí'),
(10, 1, '2025-04-02 09:55:41', 'He entregado tarde, ¿se puede corregir aún?'),
(1, 10, '2025-04-02 10:10:41', 'Sí, hasta mañana tienes margen'),
(10, 1, '2025-04-02 10:11:41', 'Gracias por avisar'),
(8, 3, '2025-03-31 17:20:41', '¿Te apuntas al taller de programación?'),
(3, 8, '2025-03-31 17:28:41', 'Claro, me interesa'),
(8, 3, '2025-03-31 17:33:41', 'Genial, yo ya estoy inscrito'),
(15, 19, '2025-04-05 08:00:41', '¿Hiciste la actividad opcional?'),
(19, 15, '2025-04-05 08:22:41', 'Sí, anoche la terminé'),
(15, 19, '2025-04-05 08:30:41', 'Perfecto, yo voy esta tarde'),
(4, 12, '2025-03-29 18:44:41', '¿Puedes pasarme la rúbrica del proyecto?'),
(12, 4, '2025-03-29 18:50:41', 'Claro, la subo al grupo'),
(4, 12, '2025-03-29 18:53:41', 'Gracias 😊'),
(12, 4, '2025-03-29 18:55:41', 'De nada, ¡suerte!'),
(7, 14, '2025-04-01 10:15:41', '¿Te gustaría hacer un repaso antes del examen?'),
(14, 7, '2025-04-01 10:30:41', 'Sí, me vendría bien'),
(7, 14, '2025-04-01 10:35:41', 'Perfecto, ¿a qué hora?'),
(9, 17, '2025-04-02 11:00:41', '¿Sabes cuándo es la reunión de padres?'),
(17, 9, '2025-04-02 11:15:41', 'El jueves a las 6 PM'),
(9, 17, '2025-04-02 11:20:41', 'Gracias por avisar')
;

INSERT INTO subject (course_id, name, class_group, teacher_id) VALUES
-- Profesor 1: Lengua en cursos 1-4 grupos A, B, C
(1, 'Lengua', 'A', 1),
(1, 'Lengua', 'B', 1),
(1, 'Lengua', 'C', 1),
(2, 'Lengua', 'A', 1),
(2, 'Lengua', 'B', 1),
(2, 'Lengua', 'C', 1),
(3, 'Lengua', 'A', 1),
(3, 'Lengua', 'B', 1),
(3, 'Lengua', 'C', 1),
(4, 'Lengua', 'A', 1),
(4, 'Lengua', 'B', 1),
(4, 'Lengua', 'C', 1),

-- Profesor 2: Matemáticas cursos 1 y 2 grupos A y B
(1, 'Matemáticas', 'A', 2),
(1, 'Matemáticas', 'B', 2),
(2, 'Matemáticas', 'A', 2),
(2, 'Matemáticas', 'B', 2),

-- Profesor 3: Ciencias Naturales cursos 1-3 grupos A y B
(1, 'Ciencias Naturales', 'A', 3),
(1, 'Ciencias Naturales', 'B', 3),
(2, 'Ciencias Naturales', 'A', 3),
(2, 'Ciencias Naturales', 'B', 3),
(3, 'Ciencias Naturales', 'A', 3),
(3, 'Ciencias Naturales', 'B', 3),

-- Profesor 4: Historia cursos 2-4 grupos A y B
(2, 'Historia', 'A', 4),
(2, 'Historia', 'B', 4),
(3, 'Historia', 'A', 4),
(3, 'Historia', 'B', 4),
(4, 'Historia', 'A', 4),
(4, 'Historia', 'B', 4),

-- Profesor 5: Inglés cursos 1 y 2 grupos A y B; cursos 3 y 4 grupos A, B, C
(1, 'Inglés', 'A', 5),
(1, 'Inglés', 'B', 5),
(2, 'Inglés', 'A', 5),
(2, 'Inglés', 'B', 5),
(3, 'Inglés', 'A', 5),
(3, 'Inglés', 'B', 5),
(3, 'Inglés', 'C', 5),
(4, 'Inglés', 'A', 5),
(4, 'Inglés', 'B', 5),
(4, 'Inglés', 'C', 5),

-- Profesor 6: Educación Física cursos 1-3 grupos A y B
(1, 'Educación Física', 'A', 6),
(1, 'Educación Física', 'B', 6),
(2, 'Educación Física', 'A', 6),
(2, 'Educación Física', 'B', 6),
(3, 'Educación Física', 'A', 6),
(3, 'Educación Física', 'B', 6),

-- Profesor 7: Artes Visuales cursos 2 y 3 grupos A, B y C
(2, 'Artes Visuales', 'A', 7),
(2, 'Artes Visuales', 'B', 7),
(2, 'Artes Visuales', 'C', 7),
(3, 'Artes Visuales', 'A', 7),
(3, 'Artes Visuales', 'B', 7),
(3, 'Artes Visuales', 'C', 7),

-- Profesor 8: Música cursos 1 y 4 grupos A y B
(1, 'Música', 'A', 8),
(1, 'Música', 'B', 8),
(4, 'Música', 'A', 8),
(4, 'Música', 'B', 8),

-- Profesor 2 (Matemáticas + Física Aplicada)
(1, 'Física Aplicada', 'A', 2),
(2, 'Física Aplicada', 'B', 2),

-- Profesor 3 (Ciencias Naturales + Biología)
(1, 'Biología', 'A', 3),
(2, 'Biología', 'B', 3),

-- Profesor 4 (Historia + Geografía)
(3, 'Geografía', 'A', 4),
(4, 'Geografía', 'B', 4),

-- Profesor 5 (Inglés + Literatura Universal)
(3, 'Literatura Universal', 'A', 5),
(4, 'Literatura Universal', 'B', 5),

-- Profesor 6 (Educación Física + Salud)
(3, 'Salud', 'A', 6),
(2, 'Salud', 'B', 6),

-- Profesor 7 (Artes Visuales + Música)
(2, 'Música', 'A', 7),
(3, 'Música', 'B', 7),

-- Profesor 8 (Música + Tecnología)
(1, 'Tecnología', 'A', 8),
(4, 'Tecnología', 'B', 8);

INSERT INTO student_subject (student_id, subject_id) VALUES
(1, 1),
(1, 9),
(1, 13),
(1, 17),
(1, 23),
(1, 29),
(1, 39),
(1, 45),
(1, 51),
(2, 2),
(2, 14),
(2, 18),
(2, 24),
(2, 30),
(2, 40),
(2, 46),
(2, 52),
(3, 3),
(3, 15),
(3, 19),
(3, 25),
(3, 31),
(3, 41),
(3, 47),
(3, 53),
(4, 4),
(4, 16),
(4, 20),
(4, 26),
(4, 32),
(4, 42),
(4, 48),
(4, 54),
(5, 5),
(5, 28),
(5, 34),
(5, 43),
(5, 50),
(6, 6),
(6, 35),
(6, 44),
(7, 7),
(7, 37),
(8, 8),
(8, 38),

(9, 1),
(9, 13),
(9, 17),
(9, 23),
(9, 29);

INSERT INTO schedule (subject_id, weekday, start_time, end_time) VALUES
(1, 'Lunes', '08:00:00', '09:00:00'),
(2, 'Lunes', '09:15:00', '10:15:00'),
(3, 'Martes', '08:00:00', '09:00:00'),
(4, 'Martes', '09:15:00', '10:15:00'),
(5, 'Miércoles', '10:30:00', '11:30:00'),
(6, 'Miércoles', '11:45:00', '12:45:00'),
(7, 'Jueves', '08:00:00', '09:00:00'),
(8, 'Jueves', '09:15:00', '10:15:00'),
(9, 'Viernes', '10:30:00', '11:30:00'),
(10, 'Viernes', '11:45:00', '12:45:00');


INSERT INTO bulletin_board_entry (subject_id, content, attachment_url, title) VALUES
(1, 'Repaso para el examen final el próximo viernes.', NULL, 'Aviso examen'),
(2, 'Se subirán las notas provisionales mañana.', NULL, 'Notas provisionales'),
(3, 'Nuevo material disponible en la plataforma.', 'http://ejemplo.com/material.pdf', 'Material extra'),
(4, 'Se cancela la clase del jueves.', NULL, 'Cancelación clase'),
(5, 'Proyecto final entregado hasta el 10 de mayo.', NULL, 'Entrega proyecto');

INSERT INTO activity (subject_id, title, content, start_date, end_date, type) VALUES
(1, 'Examen Parcial Matemáticas', 'Evaluación de álgebra y geometría', '2025-05-10 08:00:00', '2025-05-10 10:00:00', 'exam'),
(2, 'Trabajo de Lenguaje', 'Análisis de texto literario', '2025-05-12 09:00:00', '2025-05-15 23:59:59', 'assignment'),
(3, 'Laboratorio de Ciencias', 'Informe sobre reacciones químicas', '2025-05-05 14:00:00', '2025-05-07 14:00:00', 'assignment'),
(4, 'Examen Historia', 'Repaso de la Edad Media', '2025-05-20 10:00:00', '2025-05-20 12:00:00', 'exam'),
(5, 'Presentación Inglés', 'Exposición oral sobre cultura británica', '2025-05-18 11:00:00', '2025-05-18 11:30:00', 'assignment'),
(6, 'Evaluación Educación Física', 'Prueba de resistencia y flexibilidad', '2025-05-22 15:00:00', '2025-05-22 16:00:00', 'exam'),
(7, 'Tarea Artes', 'Creación de una obra pictórica', '2025-05-08 09:00:00', '2025-05-14 17:00:00', 'assignment'),
(8, 'Proyecto Tecnología', 'Desarrollo de un prototipo básico', '2025-05-11 10:00:00', '2025-05-20 18:00:00', 'assignment'),
(1, 'Examen Final Matemáticas', 'Evaluación global de curso', '2025-06-15 08:00:00', '2025-06-15 10:00:00', 'exam'),
(3, 'Examen Ciencias', 'Temas de biología y química', '2025-06-10 09:00:00', '2025-06-10 11:00:00', 'exam'),
(4, 'Ensayo Historia', 'Análisis de la Revolución Industrial', '2025-05-25 08:00:00', '2025-06-01 23:59:59', 'assignment'),
(5, 'Exposición Inglés', 'Tema sobre literatura americana', '2025-06-05 11:00:00', '2025-06-05 11:30:00', 'assignment'),
(9, 'Lectura', 'Adventures of Huckleberry Finn', '2025-05-30 11:00:00', '2025-06-28 11:30:00', 'assignment'),
(4, 'Redaccion', 'Primera Guerra Mundial', '2025-04-20 10:00:00', '2025-05-20 12:00:00', 'assignment'),
(9, 'Lectura', 'The Catcher in the Rye', '2025-04-20 10:00:00', '2025-05-20 12:00:00', 'assignment'),
(4, 'Exposicion', 'Segunda Guerra Mundial', '2025-05-31 10:00:00', '2025-06-14 12:00:00', 'assignment'),
(1, 'Tarea individual', 'Geometria', '2025-03-15 10:00:00', '2025-04-15 12:00:00', 'assignment'),
(1, 'Diagnóstico Matemáticas', 'Evaluación inicial de conocimientos', '2024-12-05 08:00:00', '2024-12-05 10:00:00', 'exam'),
(1, 'Redacción Inicial', 'Escribir sobre las vacaciones', '2024-12-10 08:00:00', '2024-12-17 23:59:59', 'assignment'),
(1, 'Proyecto Agua', 'Investigar el ciclo del agua', '2024-12-12 08:00:00', '2024-12-20 23:59:59', 'assignment'),
(13, 'Números Decimales', 'Operaciones con decimales', '2025-01-08 08:00:00', '2025-01-15 23:59:59', 'assignment'),
(13, 'Examen Decimales', 'Evaluación números decimales', '2025-01-20 09:00:00', '2025-01-20 11:00:00', 'exam'),
(1, 'Análisis Cuento', 'Leer y analizar "El Principito"', '2025-01-10 08:00:00', '2025-01-20 23:59:59', 'assignment'),
(17, 'Laboratorio Mezclas', 'Experimento separación de mezclas', '2025-01-15 14:00:00', '2025-01-22 23:59:59', 'assignment'),
(23, 'Culturas Precolombinas', 'Investigación sobre los Mayas', '2025-01-12 08:00:00', '2025-01-25 23:59:59', 'assignment'),
(29, 'Vocabulario Animals', 'Lista de 30 animales en inglés', '2025-01-18 08:00:00', '2025-01-25 23:59:59', 'assignment'),
(13, 'Fracciones Equivalentes', 'Trabajar con fracciones', '2025-02-03 08:00:00', '2025-02-10 23:59:59', 'assignment'),
(1, 'Poesía Creativa', 'Escribir tres poemas originales', '2025-02-05 08:00:00', '2025-02-15 23:59:59', 'assignment'),
(1, 'Examen Comprensión', 'Evaluación lectura comprensiva', '2025-02-18 09:00:00', '2025-02-18 11:00:00', 'exam'),
(17, 'Sistema Respiratorio', 'Maqueta del sistema respiratorio', '2025-02-08 08:00:00', '2025-02-20 23:59:59', 'assignment'),
(23, 'Conquista de América', 'Ensayo sobre la conquista', '2025-02-12 08:00:00', '2025-02-22 23:59:59', 'assignment'),
(29, 'Presentación Family', 'Presentar la familia en inglés', '2025-02-15 11:00:00', '2025-02-15 11:20:00', 'exam'),
(13, 'Geometría Plana', 'Calcular áreas y perímetros', '2025-03-03 08:00:00', '2025-03-10 23:59:59', 'assignment'),
(13, 'Examen Geometría', 'Evaluación completa geometría', '2025-03-15 09:00:00', '2025-03-15 11:00:00', 'exam'),
(1, 'Teatro Escolar', 'Crear y actuar una obra', '2025-03-05 08:00:00', '2025-03-20 23:59:59', 'assignment'),
(17, 'Feria Ciencias', 'Proyecto volcán casero', '2025-03-08 08:00:00', '2025-03-22 18:00:00', 'assignment'),
(23, 'Independencia Chile', 'Línea de tiempo independencia', '2025-03-10 08:00:00', '2025-03-25 23:59:59', 'assignment'),
(29, 'Story Telling', 'Contar una historia en inglés', '2025-03-18 11:00:00', '2025-03-18 11:30:00', 'exam'),
(13, 'Estadística Básica', 'Gráficos y tablas', '2025-04-02 08:00:00', '2025-04-09 23:59:59', 'assignment'),
(1, 'Biografía Escritor', 'Investigar vida de Gabriela Mistral', '2025-04-05 08:00:00', '2025-04-15 23:59:59', 'assignment'),
(17, 'Ecosistemas Chile', 'Mapa ecosistemas chilenos', '2025-04-08 08:00:00', '2025-04-18 23:59:59', 'assignment'),
(23, 'Examen Historia Chile', 'Evaluación historia nacional', '2025-04-20 10:00:00', '2025-04-20 12:00:00', 'exam'),
(29, 'Weather and Seasons', 'Presentación sobre el clima', '2025-04-12 11:00:00', '2025-04-12 11:20:00', 'exam'),
(13, 'Problemas Aplicados', 'Matemática en situaciones reales', '2025-05-06 08:00:00', '2025-05-13 23:59:59', 'assignment'),
(1, 'Ensayo Argumentativo', 'Opinión sobre reciclaje', '2025-05-08 08:00:00', '2025-05-18 23:59:59', 'assignment'),
(17, 'Laboratorio Plantas', 'Germinación de semillas', '2025-05-10 14:00:00', '2025-05-20 23:59:59', 'assignment'),
(23, 'Proyecto Final Historia', 'Museo histórico virtual', '2025-05-15 08:00:00', '2025-05-30 23:59:59', 'assignment'),
(1, 'Ensayo Vencido', 'Ensayo sobre literatura chilena', '2025-05-20 08:00:00', '2025-05-27 23:59:59', 'assignment'),
(13, 'Tarea Urgente', 'Ejercicios de álgebra', '2025-05-29 08:00:00', '2025-06-02 23:59:59', 'assignment'),
(17, 'Lab Urgente', 'Experimento químico', '2025-05-30 14:00:00', '2025-06-04 23:59:59', 'assignment'),
(13, 'Examen Final Matemáticas', 'Evaluación semestral completa', '2025-06-10 08:00:00', '2025-06-10 10:00:00', 'exam'),
(1, 'Examen Final Lenguaje', 'Evaluación integral lenguaje', '2025-06-12 09:00:00', '2025-06-12 11:00:00', 'exam'),
(17, 'Examen Final Ciencias', 'Evaluación anual ciencias', '2025-06-15 09:00:00', '2025-06-15 11:00:00', 'exam'),
(23, 'Examen Final Historia', 'Evaluación historia de Chile', '2025-06-17 10:00:00', '2025-06-17 12:00:00', 'exam'),
(29, 'Final English Test', 'Comprehensive English evaluation', '2025-06-20 11:00:00', '2025-06-20 12:00:00', 'exam');

INSERT INTO submission (student_id, activity_id, grade, content, student_comment, teacher_comment, submission_date, status, start_date) VALUES
(1, 1, 8.5, 'Archivo examen parcial.pdf', 'Me costó un poco la geometría', 'Buen trabajo en general', '2025-05-10 09:45:00', 'completed', '2025-05-10 08:00:00'),
(1, 2, 9.0, 'Análisis texto.docx', 'Incluí ejemplos adicionales', 'Excelente análisis', '2025-05-14 22:00:00', 'completed', '2025-05-12 09:00:00'),
(1, 3, 7.5, 'Informe laboratorio.pdf', 'Faltaron algunas observaciones', 'Revisar metodología', '2025-05-07 13:30:00', 'completed', '2025-05-05 14:00:00'),
(2, 4, NULL, 'Examen historia', NULL, NULL, NULL, 'pending', '2025-05-20 10:00:00'),
(2, 5, 10, 'Presentación.pptx', 'Preparé un video adicional', 'Muy buena presentación', '2025-05-18 11:25:00', 'completed', '2025-05-18 11:00:00'),
(2, 6, NULL, 'Evaluación EF', NULL, NULL, NULL, 'in_progress', '2025-05-22 15:00:00'),
(3, 7, 8.0, 'Obra pictórica foto.jpg', 'Intenté usar técnicas nuevas', 'Buen uso de color', '2025-05-14 16:45:00', 'completed', '2025-05-08 09:00:00'),
(4, 8, NULL, 'Proyecto tecnología.docx', 'Trabajando en prototipo', NULL, NULL, 'in_progress', '2025-05-11 10:00:00'),
(5, 9, NULL, 'Examen final matemáticas', NULL, NULL, NULL, 'pending', '2025-06-15 08:00:00'),
(6, 10, NULL, 'Examen ciencias', NULL, NULL, NULL, 'pending', '2025-06-10 09:00:00'),
(7, 11, NULL, 'Ensayo historia.docx', NULL, NULL, NULL, 'pending', '2025-05-25 08:00:00'),
(8, 12, NULL, 'Exposición inglés.pptx', NULL, NULL, NULL, 'pending', '2025-06-05 11:00:00'),
(9, 18, 5.5, 'Diagnóstico inicial', 'Estaba nerviosa por ser nueva', 'Necesita refuerzo en conceptos básicos', '2024-12-05 09:45:00', 'completed', '2024-12-05 08:00:00'),
(9, 19, 6.2, 'Redacción vacaciones', 'Escribí sobre mi viaje a la playa', 'Penalización por entrega tardía', '2024-12-20 08:30:00', 'completed', '2024-12-10 08:00:00'),
(9, 20, 7.2, 'Proyecto ciclo agua', 'Hice dibujos del ciclo', 'Muy buenos dibujos explicativos', '2024-12-19 22:45:00', 'completed', '2024-12-12 08:00:00'),
(9, 21, 7.5, 'Decimales completos', 'Practiqué con mi papá', 'Se nota el esfuerzo extra', '2025-01-14 19:15:00', 'completed', '2025-01-08 08:00:00'),
(9, 22, 7.8, 'Examen decimales', 'Revisé todo dos veces', 'Excelente mejora', '2025-01-20 10:30:00', 'completed', '2025-01-20 09:00:00'),
(9, 23, 8.0, 'Análisis El Principito', 'Me encantó el libro', 'Análisis muy maduro', '2025-01-19 18:45:00', 'completed', '2025-01-10 08:00:00'),
(9, 24, 7.9, 'Laboratorio mezclas', 'El experimento fue divertido', 'Excelente observación científica', '2025-01-21 16:30:00', 'completed', '2025-01-15 14:00:00'),
(9, 25, 8.2, 'Investigación Mayas', 'Encontré datos increíbles', 'Investigación muy completa', '2025-01-24 21:00:00', 'completed', '2025-01-12 08:00:00'),
(9, 26, 8.2, 'Vocabulario animales', 'Terminé 3 días antes', 'Excelente planificación', '2025-01-22 14:30:00', 'completed', '2025-01-18 08:00:00'),
(9, 27, 8.7, 'Fracciones equivalentes', 'Ahora entiendo mejor', 'Excelente progreso matemático', '2025-02-09 20:15:00', 'completed', '2025-02-03 08:00:00'),
(9, 28, 9.1, 'Tres poemas originales', 'Escribí sobre mi gato', 'Muy creativos y emotivos', '2025-02-13 19:45:00', 'completed', '2025-02-05 08:00:00'),
(9, 29, 8.8, 'Examen comprensión lectora', 'Estudié hasta último momento', 'Buen manejo del tiempo', '2025-02-18 10:59:00', 'completed', '2025-02-18 09:00:00'),
(9, 30, 8.9, 'Maqueta sistema respiratorio', 'Usé materiales reciclados', 'Muy creativa y educativa', '2025-02-19 17:20:00', 'completed', '2025-02-08 08:00:00'),
(9, 31, 8.6, 'Ensayo conquista América', 'Investigué en biblioteca', 'Bien fundamentado históricamente', '2025-02-21 20:30:00', 'completed', '2025-02-12 08:00:00'),
(9, 32, 9.0, 'Presentación familia inglés', 'Practiqué hasta el final', 'Perfect timing!', '2025-02-15 11:19:00', 'completed', '2025-02-15 11:00:00'),
(9, 33, 9.2, 'Geometría áreas perímetros', 'Usé fórmulas correctamente', 'Excelente aplicación matemática', '2025-03-08 18:30:00', 'completed', '2025-03-03 08:00:00'),
(9, 34, 9.9, 'Examen geometría completo', 'Estudié con diagramas', 'Outstanding mathematical skills', '2025-03-15 10:20:00', 'completed', '2025-03-15 09:00:00'),
(9, 35, 9.3, 'Obra teatro escolar', 'Escribí sobre amistad', 'Muy emotiva y bien estructurada', '2025-03-18 19:45:00', 'completed', '2025-03-05 08:00:00'),
(9, 36, 9.7, 'Proyecto volcán casero', 'Funcionó perfectamente', 'Excelente trabajo científico', '2025-03-20 16:15:00', 'completed', '2025-03-08 08:00:00'),
(9, 37, 9.0, 'Línea tiempo independencia', 'Usé colores para cada época', 'Muy bien organizada visualmente', '2025-03-23 20:00:00', 'completed', '2025-03-10 08:00:00'),
(9, 38, 9.8, 'Story telling inglés', 'Conté el cuento de Caperucita', 'Excellent storytelling skills!', '2025-03-18 11:25:00', 'completed', '2025-03-18 11:00:00'),
(9, 39, 9.1, 'Estadística gráficos', 'Hice encuesta en mi familia', 'Excelente aplicación práctica', '2025-04-08 19:30:00', 'completed', '2025-04-02 08:00:00'),
(9, 40, 9.0, 'Biografía Gabriela Mistral', 'Me gustó tanto que seguí investigando', 'Se nota el interés genuino', '2025-04-12 16:45:00', 'completed', '2025-04-05 08:00:00'),
(9, 41, 8.8, 'Mapa ecosistemas Chile', 'Aprendí sobre mi país', 'Excelente conocimiento geográfico', '2025-04-16 18:45:00', 'completed', '2025-04-08 08:00:00'),
(9, 42, 9.2, 'Examen historia Chile', 'Estudié con líneas de tiempo', 'Excelente dominio histórico', '2025-04-20 11:30:00', 'completed', '2025-04-20 10:00:00'),
(9, 43, 9.4, 'Weather and seasons', 'Hice dibujos del clima', 'Creative and accurate presentation', '2025-04-12 11:18:00', 'completed', '2025-04-12 11:00:00'),
(9, 44, 8.9, 'Problemas matemática aplicada', 'Quería asegurarme de hacerlo bien', 'Excelente actitud proactiva', '2025-05-10 18:30:00', 'completed', '2025-05-06 08:00:00'),
(9, 45, NULL, 'Ensayo reciclaje en progreso', 'Investigando datos ambientales', NULL, NULL, 'in_progress', '2025-05-08 08:00:00'),
(9, 46, NULL, 'Laboratorio plantas germinación', 'Las semillas están creciendo', NULL, NULL, 'in_progress', '2025-05-10 14:00:00'),
(9, 47, NULL, 'Museo histórico virtual', 'Diseñando las salas virtuales', NULL, NULL, 'in_progress', '2025-05-15 08:00:00'),
(9, 48, NULL, 'Ensayo literatura vencido', 'Se me pasó la fecha, lo siento', NULL, NULL, 'pending', '2025-05-20 08:00:00'),
(9, 49, NULL, 'Álgebra urgente', 'Empezando hoy', NULL, NULL, 'in_progress', '2025-05-29 08:00:00'),
(9, 50, NULL, 'Experimento químico urgente', 'Necesito materiales', NULL, NULL, 'pending', '2025-05-30 14:00:00'),
(9, 51, NULL, 'Examen final matemáticas', NULL, NULL, NULL, 'pending', '2025-06-10 08:00:00'),
(9, 52, NULL, 'Examen final lenguaje', NULL, NULL, NULL, 'pending', '2025-06-12 09:00:00'),
(9, 53, NULL, 'Examen final ciencias', NULL, NULL, NULL, 'pending', '2025-06-15 09:00:00'),
(9, 54, NULL, 'Examen final historia', NULL, NULL, NULL, 'pending', '2025-06-17 10:00:00'),
(9, 55, NULL, 'Final English test', NULL, NULL, NULL, 'pending', '2025-06-20 11:00:00');