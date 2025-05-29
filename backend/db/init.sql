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

INSERT INTO student_subject (student_id, subject_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2),
(3, 4), (3, 5),
(4, 6), (4, 7), (4, 9)
(5, 8), (5, 9),
(6, 10), (6, 11),
(7, 12), (7, 13),
(8, 14), (8, 15);

INSERT INTO schedule (subject_id, weekday, start_time, end_time) VALUES
(1, 'monday', '08:00:00', '09:00:00'),
(2, 'monday', '09:15:00', '10:15:00'),
(3, 'tuesday', '08:00:00', '09:00:00'),
(4, 'tuesday', '09:15:00', '10:15:00'),
(5, 'wednesday', '10:30:00', '11:30:00'),
(6, 'wednesday', '11:45:00', '12:45:00'),
(7, 'thursday', '08:00:00', '09:00:00'),
(8, 'thursday', '09:15:00', '10:15:00'),
(9, 'friday', '10:30:00', '11:30:00'),
(10, 'friday', '11:45:00', '12:45:00');


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
(5, 'Exposición Inglés', 'Tema sobre literatura americana', '2025-06-05 11:00:00', '2025-06-05 11:30:00', 'assignment');
(9, 'Lectura', 'Adventures of Huckleberry Finn', '2025-05-30 11:00:00', '2025-06-28 11:30:00', 'assignment');


INSERT INTO submission (student_id, activity_id, grade, content, student_comment, teacher_comment, submission_date, status, start_date) VALUES
(4, 1, 8.5, 'Archivo examen parcial.pdf', 'Me costó un poco la geometría', 'Buen trabajo en general', '2025-05-10 09:45:00', 'completed', '2025-05-10 08:00:00'),
(5, 2, 9.0, 'Análisis texto.docx', 'Incluí ejemplos adicionales', 'Excelente análisis', '2025-05-14 22:00:00', 'completed', '2025-05-12 09:00:00'),
(10, 3, 7.5, 'Informe laboratorio.pdf', 'Faltaron algunas observaciones', 'Revisar metodología', '2025-05-07 13:30:00', 'completed', '2025-05-05 14:00:00'),
(12, 4, NULL, 'Examen historia', NULL, NULL, NULL, 'pending', '2025-05-20 10:00:00'),
(15, 5, 10, 'Presentación.pptx', 'Preparé un video adicional', 'Muy buena presentación', '2025-05-18 11:25:00', 'completed', '2025-05-18 11:00:00'),
(17, 6, NULL, 'Evaluación EF', NULL, NULL, NULL, 'in_progress', '2025-05-22 15:00:00'),
(20, 7, 8.0, 'Obra pictórica foto.jpg', 'Intenté usar técnicas nuevas', 'Buen uso de color', '2025-05-14 16:45:00', 'completed', '2025-05-08 09:00:00'),
(22, 8, NULL, 'Proyecto tecnología.docx', 'Trabajando en prototipo', NULL, NULL, 'in_progress', '2025-05-11 10:00:00'),
(4, 9, NULL, 'Examen final matemáticas', NULL, NULL, NULL, 'pending', '2025-06-15 08:00:00'),
(10, 10, NULL, 'Examen ciencias', NULL, NULL, NULL, 'pending', '2025-06-10 09:00:00'),
(12, 11, NULL, 'Ensayo historia.docx', NULL, NULL, NULL, 'pending', '2025-05-25 08:00:00'),
(15, 12, NULL, 'Exposición inglés.pptx', NULL, NULL, NULL, 'pending', '2025-06-05 11:00:00');

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES user(user_id)
);
