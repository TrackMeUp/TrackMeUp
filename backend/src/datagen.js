const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const CONFIG = {
  ROL_COUNT: 4,
  USER_COUNT: 100,
  ADMIN_PERCENT: 5,
  TEACHER_PERCENT: 15,
  STUDENT_PERCENT: 60,
  PARENT_PERCENT: 20,
  COURSE_COUNT: 10,
  SUBJECT_PER_COURSE_MIN: 5,
  SUBJECT_PER_COURSE_MAX: 10,
  MESSAGE_COUNT: 200,
  ANNOUNCEMENT_COUNT: 50,
  ACTIVITY_COUNT: 100,
  DELIVERY_COUNT: 150,
};

async function selectDatabase() {
  try {
    await pool.query('USE tmu');
    console.log('Database "tmu" selected');
  } catch (error) {
    console.error('Failed to select database:', error);
    throw error;
  }
}

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomSubset = (array, min, max) => {
  const size = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function generateData() {
  try {
    console.log('Starting data generation...');
    
    await selectDatabase();

    await clearAllTables();
    
    const roleIds = await generateRoles();
    console.log(`Generated ${roleIds.length} roles`);
    
    const users = await generateUsers(roleIds);
    console.log(`Generated ${users.length} users`);
    
    const adminUsers = users.filter(user => user.role_id === roleIds[0]);
    const teacherUsers = users.filter(user => user.role_id === roleIds[1]);
    const studentUsers = users.filter(user => user.role_id === roleIds[2]);
    const parentUsers = users.filter(user => user.role_id === roleIds[3]);
    
    const admins = await generateAdmins(adminUsers);
    console.log(`Generated ${admins.length} admins`);
    
    const teachers = await generateTeachers(teacherUsers);
    console.log(`Generated ${teachers.length} teachers`);
    
    const students = await generateStudents(studentUsers);
    console.log(`Generated ${students.length} students`);
    
    const parents = await generateParents(parentUsers, students);
    console.log(`Generated ${parents.length} parents`);
    
    const messages = await generateMessages(users);
    console.log(`Generated ${messages.length} messages`);
    
    const courses = await generateCourses();
    console.log(`Generated ${courses.length} courses`);
    
    const subjects = await generateSubjects(courses, teachers);
    console.log(`Generated ${subjects.length} subjects`);
    
    await associateStudentsWithSubjects(students, subjects);
    console.log('Associated students with subjects');
    
    const schedules = await generateSchedules(subjects);
    console.log(`Generated ${schedules.length} schedules`);
    
    const announcements = await generateAnnouncements(subjects);
    console.log(`Generated ${announcements.length} announcements`);
    
    const activities = await generateActivities(subjects);
    console.log(`Generated ${activities.length} activities`);
    
    const deliveries = await generateDeliveries(activities, students);
    console.log(`Generated ${deliveries.length} deliveries`);
    
    console.log('Data generation completed successfully!');
  } catch (error) {
    console.error('Error generating data:', error);
  } finally {
    await pool.end();
  }
}

async function clearAllTables() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await connection.query('TRUNCATE TABLE entrega');
    await connection.query('TRUNCATE TABLE actividad');
    await connection.query('TRUNCATE TABLE entrada_tablon_anuncios');
    await connection.query('TRUNCATE TABLE horario');
    await connection.query('TRUNCATE TABLE estudiante_asignatura');
    await connection.query('TRUNCATE TABLE asignatura');
    await connection.query('TRUNCATE TABLE curso');
    await connection.query('TRUNCATE TABLE mensaje');
    await connection.query('TRUNCATE TABLE padre');
    await connection.query('TRUNCATE TABLE estudiante');
    await connection.query('TRUNCATE TABLE docente');
    await connection.query('TRUNCATE TABLE admin');
    await connection.query('TRUNCATE TABLE usuario');
    await connection.query('TRUNCATE TABLE rol');
    
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    await connection.commit();
    console.log('All tables cleared');
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function generateRoles() {
  const roles = [
    { nombre: 'Administrador' },
    { nombre: 'Docente' },
    { nombre: 'Estudiante' },
    { nombre: 'Padre' }
  ];
  
  const roleIds = [];
  for (const role of roles) {
    const [result] = await pool.query('INSERT INTO rol (nombre) VALUES (?)', [role.nombre]);
    roleIds.push(result.insertId);
  }
  
  return roleIds;
}

async function generateUsers(roleIds) {
  const users = [];
  const userDistribution = [
    { roleId: roleIds[0], count: Math.floor(CONFIG.USER_COUNT * CONFIG.ADMIN_PERCENT / 100) },
    { roleId: roleIds[1], count: Math.floor(CONFIG.USER_COUNT * CONFIG.TEACHER_PERCENT / 100) },
    { roleId: roleIds[2], count: Math.floor(CONFIG.USER_COUNT * CONFIG.STUDENT_PERCENT / 100) },
    { roleId: roleIds[3], count: Math.floor(CONFIG.USER_COUNT * CONFIG.PARENT_PERCENT / 100) }
  ];
  
  userDistribution.forEach(dist => {
    if (dist.count < 1) dist.count = 1;
  });
  
  for (const distribution of userDistribution) {
    for (let i = 0; i < distribution.count; i++) {
      const user = {
        nombre: faker.person.firstName(),
        apellido_1: faker.person.lastName(),
        apellido_2: faker.person.lastName(),
        email: faker.internet.email(),
        id_rol: distribution.roleId,
        password: await bcrypt.hash('password123', 10)
      };
      
      const [result] = await pool.query(
        'INSERT INTO usuario (nombre, apellido_1, apellido_2, email, id_rol, password) VALUES (?, ?, ?, ?, ?, ?)',
        [user.nombre, user.apellido_1, user.apellido_2, user.email, user.id_rol, user.password]
      );
      
      users.push({
        id: result.insertId,
        ...user,
        role_id: user.id_rol
      });
    }
  }
  
  return users;
}

async function generateAdmins(adminUsers) {
  const admins = [];
  
  for (const user of adminUsers) {
    const admin = {
      id_usuario: user.id,
      nivel_acceso: getRandomInt(1, 3)
    };
    
    const [result] = await pool.query(
      'INSERT INTO admin (id_usuario, nivel_acceso) VALUES (?, ?)',
      [admin.id_usuario, admin.nivel_acceso]
    );
    
    admins.push({
      id: result.insertId,
      ...admin
    });
  }
  
  return admins;
}

async function generateTeachers(teacherUsers) {
  const teachers = [];
  
  for (const user of teacherUsers) {
    const [result] = await pool.query(
      'INSERT INTO docente (id_usuario) VALUES (?)',
      [user.id]
    );
    
    teachers.push({
      id: result.insertId,
      id_usuario: user.id
    });
  }
  
  return teachers;
}

async function generateStudents(studentUsers) {
  const students = [];
  
  for (const user of studentUsers) {
    const [result] = await pool.query(
      'INSERT INTO estudiante (id_usuario) VALUES (?)',
      [user.id]
    );
    
    students.push({
      id: result.insertId,
      id_usuario: user.id
    });
  }
  
  return students;
}

async function generateParents(parentUsers, students) {
  const parents = [];
  
  for (const user of parentUsers) {
    const student = getRandomElement(students);
    
    const [result] = await pool.query(
      'INSERT INTO padre (id_usuario, id_estudiante) VALUES (?, ?)',
      [user.id, student.id]
    );
    
    parents.push({
      id: result.insertId,
      id_usuario: user.id,
      id_estudiante: student.id
    });
  }
  
  return parents;
}

async function generateMessages(users) {
  const messages = [];
  
  for (let i = 0; i < CONFIG.MESSAGE_COUNT; i++) {
    const sender = getRandomElement(users);
    const receiver = getRandomElement(users.filter(u => u.id !== sender.id));
    
    const message = {
      id_usuario_autor: sender.id,
      id_usuario_receptor: receiver.id,
      fecha: faker.date.between({ from: '2023-01-01', to: '2025-03-16' }),
      contenido: faker.lorem.paragraph().substring(0, 250)
    };
    
    const [result] = await pool.query(
      'INSERT INTO mensaje (id_usuario_autor, id_usuario_receptor, fecha, contenido) VALUES (?, ?, ?, ?)',
      [message.id_usuario_autor, message.id_usuario_receptor, message.fecha, message.contenido]
    );
    
    messages.push({
      id: result.insertId,
      ...message
    });
  }
  
  return messages;
}

async function generateCourses() {
  const courses = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < CONFIG.COURSE_COUNT; i++) {
    const startYear = currentYear - getRandomInt(0, 3);
    const endYear = startYear + getRandomInt(1, 3);
    
    const course = {
      nombre: `Curso ${faker.number.int(100)} - ${faker.word.adjective()}`,
      inicio: startYear,
      fin: endYear
    };
    
    const [result] = await pool.query(
      'INSERT INTO curso (nombre, inicio, fin) VALUES (?, ?, ?)',
      [course.nombre, course.inicio, course.fin]
    );
    
    courses.push({
      id: result.insertId,
      ...course
    });
  }
  
  return courses;
}

async function generateSubjects(courses, teachers) {
  const subjects = [];
  const groups = ['A', 'B', 'C', 'D', 'E'];
  
  for (const course of courses) {
    const subjectCount = getRandomInt(CONFIG.SUBJECT_PER_COURSE_MIN, CONFIG.SUBJECT_PER_COURSE_MAX);
    
    for (let i = 0; i < subjectCount; i++) {
      const subjectName = faker.company.buzzNoun();
      const group = getRandomElement(groups);
      const teacher = getRandomElement(teachers);
      
      const subject = {
        id_curso: course.id,
        nombre: subjectName,
        grupo: group,
        id_docente: teacher.id
      };
      
      try {
        const [result] = await pool.query(
          'INSERT INTO asignatura (id_curso, nombre, grupo, id_docente) VALUES (?, ?, ?, ?)',
          [subject.id_curso, subject.nombre, subject.grupo, subject.id_docente]
        );
        
        subjects.push({
          id: result.insertId,
          ...subject
        });
      } catch (error) {
        console.warn('Duplicate subject entry detected, skipping...');
      }
    }
  }
  
  return subjects;
}

async function associateStudentsWithSubjects(students, subjects) {
  for (const student of students) {
    const studentSubjects = getRandomSubset(subjects, 3, 7);
    
    for (const subject of studentSubjects) {
      try {
        await pool.query(
          'INSERT INTO estudiante_asignatura (id_estudiante, id_asignatura) VALUES (?, ?)',
          [student.id, subject.id]
        );
      } catch (error) {
        console.warn('Duplicate student-subject entry detected, skipping...');
      }
    }
  }
}
async function generateSchedules(subjects) {
  const schedules = [];
  const weekdays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  
  for (const subject of subjects) {
    const scheduleCount = getRandomInt(2, 3);
    
    const subjectDays = getRandomSubset(weekdays, scheduleCount, scheduleCount);
    
    for (const day of subjectDays) {
      const startHour = getRandomInt(8, 18);
      const startMinute = getRandomInt(0, 1) * 30;
      const durationHours = getRandomInt(1, 2);
      
      const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`;
      const endTime = `${(startHour + durationHours).toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`;
      
      const schedule = {
        id_asignatura: subject.id,
        dia_semana: day,
        hora_inicio: startTime,
        hora_fin: endTime
      };
      
      const [result] = await pool.query(
        'INSERT INTO horario (id_asignatura, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)',
        [schedule.id_asignatura, schedule.dia_semana, schedule.hora_inicio, schedule.hora_fin]
      );
      
      schedules.push({
        id: result.insertId,
        ...schedule
      });
    }
  }
  
  return schedules;
}

async function generateAnnouncements(subjects) {
  const announcements = [];
  
  for (let i = 0; i < CONFIG.ANNOUNCEMENT_COUNT; i++) {
    const subject = getRandomElement(subjects);
    
    const announcement = {
      id_asignatura: subject.id,
      contenido: faker.lorem.paragraphs().substring(0, 250),
      url_archivo_adjunto: Math.random() > 0.5 ? faker.image.url() : null,
      titulo: faker.lorem.sentence(2)
    };
    
    const [result] = await pool.query(
      'INSERT INTO entrada_tablon_anuncios (id_asignatura, contenido, url_archivo_adjunto, titulo) VALUES (?, ?, ?, ?)',
      [announcement.id_asignatura, announcement.contenido, announcement.url_archivo_adjunto, announcement.titulo]
    );
    
    announcements.push({
      id: result.insertId,
      ...announcement
    });
  }
  
  return announcements;
}

async function generateActivities(subjects) {
  const activities = [];
  const activityTypes = ['examen', 'tarea'];
  
  for (let i = 0; i < CONFIG.ACTIVITY_COUNT; i++) {
    const subject = getRandomElement(subjects);
    const type = getRandomElement(activityTypes);
    
    const startDate = faker.date.between({ from: '2023-09-01', to: '2024-06-30' });
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + getRandomInt(1, 30));
    
    const activity = {
      id_asignatura: subject.id,
      titulo: `${faker.word.adjective()} ${faker.word.noun()}`,
      contenido: faker.lorem.paragraphs().substring(0, 250),
      fecha_inicio: startDate,
      fecha_fin: endDate,
      tipo: type
    };
    
    const [result] = await pool.query(
      'INSERT INTO actividad (id_asignatura, titulo, contenido, fecha_inicio, fecha_fin, tipo) VALUES (?, ?, ?, ?, ?, ?)',
      [activity.id_asignatura, activity.titulo, activity.contenido, activity.fecha_inicio, activity.fecha_fin, activity.tipo]
    );
    
    activities.push({
      id: result.insertId,
      ...activity
    });
  }
  
  return activities;
}

async function generateDeliveries(activities, students) {
  const deliveries = [];
  const states = ['pendiente', 'progreso', 'finalizada'];
  
  for (let i = 0; i < CONFIG.DELIVERY_COUNT; i++) {
    const activity = getRandomElement(activities);
    
    const [enrolledStudentRows] = await pool.query(
      `SELECT e.id_estudiante FROM estudiante_asignatura ea
       JOIN asignatura a ON ea.id_asignatura = a.id_asignatura
       JOIN estudiante e ON ea.id_estudiante = e.id_estudiante
       WHERE a.id_asignatura = ?`,
      [activity.id_asignatura]
    );
    
    if (enrolledStudentRows.length === 0) {
      continue;
    }
    
    const enrolledStudent = getRandomElement(enrolledStudentRows);
    const state = getRandomElement(states);
    
    const startDate = new Date(activity.fecha_inicio);
    startDate.setDate(startDate.getDate() + getRandomInt(0, 3));
    
    let deliveryDate = null;
    let grade = null;
    let teacherComment = null;
    
    if (state === 'finalizada') {
      deliveryDate = new Date(startDate);
      deliveryDate.setDate(deliveryDate.getDate() + getRandomInt(1, 7));
      
      if (deliveryDate > activity.fecha_fin) {
        deliveryDate = new Date(activity.fecha_fin);
      }
      
      grade = getRandomInt(50, 100) / 10;
      teacherComment = getRandomInt(1, 3) === 1 ? faker.lorem.sentence() : null;
    }
    
    const delivery = {
      id_estudiante: enrolledStudent.id_estudiante,
      id_actividad: activity.id,
      calificacion: grade,
      contenido: faker.lorem.paragraphs().substring(0, 250),
      comentario_estudiante: getRandomInt(1, 3) === 1 ? faker.lorem.sentence().substring(0, 250) : null,
      comentario_docente: teacherComment ? teacherComment.substring(0, 250) : null,
      fecha_entrega: deliveryDate,
      estado: state,
      fecha_inicio: startDate
    };
    
    const [result] = await pool.query(
      `INSERT INTO entrega (id_estudiante, id_actividad, calificacion, contenido, 
       comentario_estudiante, comentario_docente, fecha_entrega, estado, fecha_inicio) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        delivery.id_estudiante, 
        delivery.id_actividad, 
        delivery.calificacion, 
        delivery.contenido, 
        delivery.comentario_estudiante, 
        delivery.comentario_docente, 
        delivery.fecha_entrega, 
        delivery.estado, 
        delivery.fecha_inicio
      ]
    );
    
    deliveries.push({
      id: result.insertId,
      ...delivery
    });
  }
  
  return deliveries;
}

async function main() {
  const startTime = new Date();
  console.log(`Starting data generation at ${startTime.toISOString()}`);
  
  try {
    await generateData();
    
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    console.log(`Data generation completed in ${duration.toFixed(2)} seconds`);
  } catch (error) {
    console.error('Error in data generation:', error);
  }
}

main();
