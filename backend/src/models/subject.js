import pool from "../db/connection.js";

class Subject {
  static async create(data) {
    if (!data.course_id) {
      throw new Error("course_id is required");
    }
    if (!data.name || data.name.trim() === "") {
      throw new Error("Subject name is required");
    }
    if (!data.class_group || data.class_group.trim() === "") {
      throw new Error("Class group is required");
    }
    if (!data.teacher_id) {
      throw new Error("teacher_id is required (database constraint)");
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [teacherRows] = await connection.execute(
        "SELECT teacher_id FROM teacher WHERE user_id = ?",
        [data.teacher_id],
      );

      if (teacherRows.length === 0) {
        throw new Error(`Teacher not found for user_id: ${data.teacher_id}`);
      }

      const teacherId = teacherRows[0].teacher_id;

      const [result] = await connection.execute(
        "INSERT INTO subject (course_id, name, class_group, teacher_id) VALUES (?, ?, ?, ?)",
        [data.course_id, data.name.trim(), data.class_group.trim(), teacherId],
      );

      const subjectId = result.insertId;

      if (
        data.schedules &&
        Array.isArray(data.schedules) &&
        data.schedules.length > 0
      ) {
        for (const schedule of data.schedules) {
          if (!schedule.weekday || !schedule.start_time || !schedule.end_time) {
            continue;
          }

          await connection.execute(
            "INSERT INTO schedule (subject_id, weekday, start_time, end_time) VALUES (?, ?, ?, ?)",
            [
              subjectId,
              schedule.weekday,
              schedule.start_time,
              schedule.end_time,
            ],
          );
        }
      }

      if (
        data.student_ids &&
        Array.isArray(data.student_ids) &&
        data.student_ids.length > 0
      ) {
        for (const studentUserId of data.student_ids) {
          if (!studentUserId || studentUserId === "") continue;

          const [studentRows] = await connection.execute(
            "SELECT student_id FROM student WHERE user_id = ?",
            [studentUserId],
          );

          if (studentRows.length > 0) {
            await connection.execute(
              "INSERT INTO student_subject (student_id, subject_id) VALUES (?, ?)",
              [studentRows[0].student_id, subjectId],
            );
          }
        }
      }

      await connection.commit();
      return { insertId: subjectId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const updateFields = [];
      const updateValues = [];

      if (data.name !== undefined && data.name.trim() !== "") {
        updateFields.push("name = ?");
        updateValues.push(data.name.trim());
      }
      if (data.class_group !== undefined && data.class_group.trim() !== "") {
        updateFields.push("class_group = ?");
        updateValues.push(data.class_group.trim());
      }
      if (data.teacher_id !== undefined && data.teacher_id !== "") {
        const [teacherRows] = await connection.execute(
          "SELECT teacher_id FROM teacher WHERE user_id = ?",
          [data.teacher_id],
        );
        if (teacherRows.length > 0) {
          updateFields.push("teacher_id = ?");
          updateValues.push(teacherRows[0].teacher_id);
        } else {
          throw new Error(`Teacher not found for user_id: ${data.teacher_id}`);
        }
      }

      if (updateFields.length > 0) {
        updateValues.push(id);
        const [result] = await connection.execute(
          `UPDATE subject SET ${updateFields.join(", ")} WHERE subject_id = ?`,
          updateValues,
        );

        if (result.affectedRows === 0) {
          await connection.rollback();
          return false;
        }
      }

      if (data.schedules !== undefined) {
        await connection.execute("DELETE FROM schedule WHERE subject_id = ?", [
          id,
        ]);

        if (Array.isArray(data.schedules) && data.schedules.length > 0) {
          for (const schedule of data.schedules) {
            if (
              !schedule.weekday ||
              !schedule.start_time ||
              !schedule.end_time
            ) {
              continue;
            }

            await connection.execute(
              "INSERT INTO schedule (subject_id, weekday, start_time, end_time) VALUES (?, ?, ?, ?)",
              [id, schedule.weekday, schedule.start_time, schedule.end_time],
            );
          }
        }
      }

      if (data.student_ids !== undefined) {
        await connection.execute(
          "DELETE FROM student_subject WHERE subject_id = ?",
          [id],
        );

        if (Array.isArray(data.student_ids) && data.student_ids.length > 0) {
          for (const studentUserId of data.student_ids) {
            if (!studentUserId || studentUserId === "") continue;

            const [studentRows] = await connection.execute(
              "SELECT student_id FROM student WHERE user_id = ?",
              [studentUserId],
            );

            if (studentRows.length > 0) {
              await connection.execute(
                "INSERT INTO student_subject (student_id, subject_id) VALUES (?, ?)",
                [studentRows[0].student_id, id],
              );
            }
          }
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM subject WHERE subject_id = ?",
        [id],
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        `
        SELECT 
          s.subject_id,
          s.course_id,
          s.name,
          s.class_group,
          u.user_id as teacher_user_id,
          u.first_name as teacher_first_name,
          u.last_name1 as teacher_last_name1,
          u.last_name2 as teacher_last_name2
        FROM subject s
        JOIN teacher t ON s.teacher_id = t.teacher_id
        JOIN user u ON t.user_id = u.user_id
        WHERE s.subject_id = ?
      `,
        [id],
      );

      if (rows.length === 0) {
        return null;
      }

      const subject = rows[0];

      const [schedules] = await pool.execute(
        `
        SELECT schedule_id, weekday, start_time, end_time
        FROM schedule
        WHERE subject_id = ?
        ORDER BY 
          FIELD(weekday, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'),
          start_time
      `,
        [id],
      );

      const [students] = await pool.execute(
        `
        SELECT 
          u.user_id,
          u.first_name,
          u.last_name1,
          u.last_name2
        FROM student_subject ss
        JOIN student st ON ss.student_id = st.student_id
        JOIN user u ON st.user_id = u.user_id
        WHERE ss.subject_id = ?
        ORDER BY u.first_name, u.last_name1
      `,
        [id],
      );

      return {
        subject_id: subject.subject_id,
        course_id: subject.course_id,
        name: subject.name,
        class_group: subject.class_group,
        teacher: {
          user_id: subject.teacher_user_id,
          first_name: subject.teacher_first_name,
          last_name1: subject.teacher_last_name1,
          last_name2: subject.teacher_last_name2,
        },
        schedules: schedules,
        students: students,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          s.subject_id,
          s.course_id,
          s.name,
          s.class_group,
          u.user_id as teacher_user_id,
          u.first_name as teacher_first_name,
          u.last_name1 as teacher_last_name1,
          u.last_name2 as teacher_last_name2
        FROM subject s
        JOIN teacher t ON s.teacher_id = t.teacher_id
        JOIN user u ON t.user_id = u.user_id
        ORDER BY s.name
      `);

      const subjects = [];

      for (const row of rows) {
        const [schedules] = await pool.execute(
          `
          SELECT schedule_id, weekday, start_time, end_time
          FROM schedule
          WHERE subject_id = ?
          ORDER BY 
            FIELD(weekday, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'),
            start_time
        `,
          [row.subject_id],
        );

        const [students] = await pool.execute(
          `
          SELECT 
            u.user_id,
            u.first_name,
            u.last_name1,
            u.last_name2
          FROM student_subject ss
          JOIN student st ON ss.student_id = st.student_id
          JOIN user u ON st.user_id = u.user_id
          WHERE ss.subject_id = ?
          ORDER BY u.first_name, u.last_name1
        `,
          [row.subject_id],
        );

        subjects.push({
          subject_id: row.subject_id,
          course_id: row.course_id,
          name: row.name,
          class_group: row.class_group,
          teacher: {
            user_id: row.teacher_user_id,
            first_name: row.teacher_first_name,
            last_name1: row.teacher_last_name1,
            last_name2: row.teacher_last_name2,
          },
          schedules: schedules,
          students: students,
        });
      }

      return subjects;
    } catch (error) {
      throw error;
    }
  }

  static async assignUser(subjectId, userId, role) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (role === "teacher") {
        const [teacherRows] = await connection.execute(
          "SELECT teacher_id FROM teacher WHERE user_id = ?",
          [userId],
        );

        if (teacherRows.length === 0) {
          throw new Error("Teacher not found for the given user ID");
        }

        const [result] = await connection.execute(
          "UPDATE subject SET teacher_id = ? WHERE subject_id = ?",
          [teacherRows[0].teacher_id, subjectId],
        );

        if (result.affectedRows === 0) {
          throw new Error("Subject not found");
        }
      } else if (role === "student") {
        const [studentRows] = await connection.execute(
          "SELECT student_id FROM student WHERE user_id = ?",
          [userId],
        );

        if (studentRows.length === 0) {
          throw new Error("Student not found for the given user ID");
        }

        const [existingRows] = await connection.execute(
          "SELECT 1 FROM student_subject WHERE student_id = ? AND subject_id = ?",
          [studentRows[0].student_id, subjectId],
        );

        if (existingRows.length === 0) {
          await connection.execute(
            "INSERT INTO student_subject (student_id, subject_id) VALUES (?, ?)",
            [studentRows[0].student_id, subjectId],
          );
        }
      } else {
        throw new Error("Invalid role specified");
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getDistinctSubjectNames(teacherId) {
    const [rows] = await pool.execute(
      `SELECT DISTINCT name FROM subject WHERE teacher_id = ?`,
      [teacherId]
    );
    return rows;
  }

  static async getGroupsBySubjectAndTeacher(teacherId, subjectName) {
    const [rows] = await pool.execute(
      `SELECT s.subject_id, CONCAT(c.name, ' ', s.class_group) AS course_and_group
       FROM subject s
       JOIN course c ON s.course_id = c.course_id
       WHERE s.teacher_id = ? AND s.name = ?`,
      [teacherId, subjectName]
    );
    return rows;
  }
}

export default Subject;
