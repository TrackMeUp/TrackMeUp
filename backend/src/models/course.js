import pool from "../db/connection.js";

class Course {
  static async create(data) {
    const [result] = await pool.execute(
      "INSERT INTO course (name, start_year, end_year) VALUES (?, ?, ?)",
      [data.name, data.start_year, data.end_year],
    );

    return { insertId: result.insertId };
  }

  static async update(id, data) {
    const [result] = await pool.execute(
      "UPDATE course SET name = ?, start_year = ?, end_year = ? WHERE course_id = ?",
      [data.name, data.start_year, data.end_year, id],
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM course WHERE course_id = ?",
      [id],
    );

    return result.affectedRows > 0;
  }

  static async getById(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        -- Course information
        c.course_id,
        c.name as course_name,
        c.start_year,
        c.end_year,
        
        -- Subject information
        s.subject_id,
        s.name as subject_name,
        s.class_group,
        
        -- Teacher information
        t.teacher_id,
        tu.user_id as teacher_user_id,
        tu.first_name as teacher_first_name,
        tu.last_name1 as teacher_last_name1,
        tu.last_name2 as teacher_last_name2,
        tu.email as teacher_email,
        
        -- Student information
        st.student_id,
        su.user_id as student_user_id,
        su.first_name as student_first_name,
        su.last_name1 as student_last_name1,
        su.last_name2 as student_last_name2,
        su.email as student_email,
        
        -- Schedule information
        sch.schedule_id,
        sch.weekday,
        sch.start_time,
        sch.end_time

      FROM course c
      LEFT JOIN subject s ON c.course_id = s.course_id
      LEFT JOIN teacher t ON s.teacher_id = t.teacher_id
      LEFT JOIN user tu ON t.user_id = tu.user_id
      LEFT JOIN student_subject ss ON s.subject_id = ss.subject_id
      LEFT JOIN student st ON ss.student_id = st.student_id
      LEFT JOIN user su ON st.user_id = su.user_id
      LEFT JOIN schedule sch ON s.subject_id = sch.subject_id

      WHERE c.course_id = ?

      ORDER BY 
        s.subject_id,
        st.student_id,
        sch.weekday,
        sch.start_time
    `,
      [id],
    );

    if (!rows.length) return null;

    const course = {
      course_id: rows[0].course_id,
      name: rows[0].course_name,
      start_year: rows[0].start_year,
      end_year: rows[0].end_year,
      subjects: new Map(),
    };

    rows.forEach((row) => {
      const subjectId = row.subject_id;

      if (subjectId && !course.subjects.has(subjectId)) {
        course.subjects.set(subjectId, {
          subject_id: row.subject_id,
          name: row.subject_name,
          class_group: row.class_group,
          teacher: row.teacher_id
            ? {
                teacher_id: row.teacher_id,
                user_id: row.teacher_user_id,
                first_name: row.teacher_first_name,
                last_name1: row.teacher_last_name1,
                last_name2: row.teacher_last_name2,
                email: row.teacher_email,
                role: "teacher",
              }
            : null,
          students: new Map(),
          schedules: new Map(),
        });
      }

      if (subjectId) {
        const subject = course.subjects.get(subjectId);

        if (row.student_id && !subject.students.has(row.student_id)) {
          subject.students.set(row.student_id, {
            student_id: row.student_id,
            user_id: row.student_user_id,
            first_name: row.student_first_name,
            last_name1: row.student_last_name1,
            last_name2: row.student_last_name2,
            email: row.student_email,
            role: "student",
          });
        }

        if (row.schedule_id && !subject.schedules.has(row.schedule_id)) {
          subject.schedules.set(row.schedule_id, {
            schedule_id: row.schedule_id,
            weekday: row.weekday,
            start_time: row.start_time,
            end_time: row.end_time,
          });
        }
      }
    });

    return {
      ...course,
      subjects: Array.from(course.subjects.values()).map((subject) => ({
        ...subject,
        students: Array.from(subject.students.values()),
        schedules: Array.from(subject.schedules.values()),
      })),
    };
  }

  static async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        -- Course information
        c.course_id,
        c.name as course_name,
        c.start_year,
        c.end_year,
        
        -- Subject information
        s.subject_id,
        s.name as subject_name,
        s.class_group,
        
        -- Teacher information
        t.teacher_id,
        tu.user_id as teacher_user_id,
        tu.first_name as teacher_first_name,
        tu.last_name1 as teacher_last_name1,
        tu.last_name2 as teacher_last_name2,
        tu.email as teacher_email,
        
        -- Student information
        st.student_id,
        su.user_id as student_user_id,
        su.first_name as student_first_name,
        su.last_name1 as student_last_name1,
        su.last_name2 as student_last_name2,
        su.email as student_email,
        
        -- Schedule information
        sch.schedule_id,
        sch.weekday,
        sch.start_time,
        sch.end_time

      FROM course c
      LEFT JOIN subject s ON c.course_id = s.course_id
      LEFT JOIN teacher t ON s.teacher_id = t.teacher_id
      LEFT JOIN user tu ON t.user_id = tu.user_id
      LEFT JOIN student_subject ss ON s.subject_id = ss.subject_id
      LEFT JOIN student st ON ss.student_id = st.student_id
      LEFT JOIN user su ON st.user_id = su.user_id
      LEFT JOIN schedule sch ON s.subject_id = sch.subject_id

      ORDER BY 
        c.course_id,
        s.subject_id,
        st.student_id,
        sch.weekday,
        sch.start_time
    `);

    if (!rows.length) return [];

    const coursesMap = new Map();

    rows.forEach((row) => {
      const courseId = row.course_id;

      if (!coursesMap.has(courseId)) {
        coursesMap.set(courseId, {
          course_id: row.course_id,
          name: row.course_name,
          start_year: row.start_year,
          end_year: row.end_year,
          subjects: new Map(),
        });
      }

      const course = coursesMap.get(courseId);
      const subjectId = row.subject_id;

      if (subjectId && !course.subjects.has(subjectId)) {
        course.subjects.set(subjectId, {
          subject_id: row.subject_id,
          name: row.subject_name,
          class_group: row.class_group,
          teacher: row.teacher_id
            ? {
                teacher_id: row.teacher_id,
                user_id: row.teacher_user_id,
                first_name: row.teacher_first_name,
                last_name1: row.teacher_last_name1,
                last_name2: row.teacher_last_name2,
                email: row.teacher_email,
                role: "teacher",
              }
            : null,
          students: new Map(),
          schedules: new Map(),
        });
      }

      if (subjectId) {
        const subject = course.subjects.get(subjectId);

        if (row.student_id && !subject.students.has(row.student_id)) {
          subject.students.set(row.student_id, {
            student_id: row.student_id,
            user_id: row.student_user_id,
            first_name: row.student_first_name,
            last_name1: row.student_last_name1,
            last_name2: row.student_last_name2,
            email: row.student_email,
            role: "student",
          });
        }

        if (row.schedule_id && !subject.schedules.has(row.schedule_id)) {
          subject.schedules.set(row.schedule_id, {
            schedule_id: row.schedule_id,
            weekday: row.weekday,
            start_time: row.start_time,
            end_time: row.end_time,
          });
        }
      }
    });

    return Array.from(coursesMap.values()).map((course) => ({
      ...course,
      subjects: Array.from(course.subjects.values()).map((subject) => ({
        ...subject,
        students: Array.from(subject.students.values()),
        schedules: Array.from(subject.schedules.values()),
      })),
    }));
  }
}

export default Course;
