import pool from "../db/connection.js";

class AcademicInfo {

    // Vista para el rol "Estudiante"
    static async getStudentAcademicInfo(userId) {
        const [rows] = await pool.execute(

            `SELECT 
            c.name AS course_name,
            CONCAT(c.start_year, '-', c.end_year) AS academic_year,
            s.subject_id,
            s.name AS subject_name,
            s.class_group,
            sch.weekday AS day_of_week,
            sch.start_time,
            sch.end_time
        FROM student st
        JOIN student_subject ss ON ss.student_id = st.student_id
        JOIN subject s ON s.subject_id = ss.subject_id
        JOIN course c ON c.course_id = s.course_id
        LEFT JOIN schedule sch ON sch.subject_id = s.subject_id
        WHERE st.user_id = ?
        
        `, [userId]);

        if (rows.length === 0) return null;

        const courseInfo = {
            course_name: rows[0].course_name,
            academic_year: rows[0].academic_year,
            subjects: [],
        };

        const subjects = {};

        for (const row of rows) {
            if (!subjects[row.subject_id]) {
                subjects[row.subject_id] = {
                    subject_id: row.subject_id,
                    subject_name: row.subject_name,
                    class_group: row.class_group,
                    schedule: []
                };
                courseInfo.subjects.push(subjects[row.subject_id]);
            }

            if (row.day_of_week && row.start_time && row.end_time) {
                subjects[row.subject_id].schedule.push({
                    day: row.day_of_week,
                    start: row.start_time,
                    end: row.end_time
                });
            }
        }

        return courseInfo;
    }

    // Vista para el rol "Padre"
    static async getParentAcademicInfo(userId) {

        const [[parentRow]] = await pool.execute(`
        SELECT s.user_id AS student_user_id
        FROM parent p
        JOIN student s ON s.student_id = p.student_id
        WHERE p.user_id = ?

        `, [userId]);

        if (!parentRow) return null;

        // Reutiliza la lógica del estudiante
        return await this.getStudentAcademicInfo(parentRow.student_user_id);

    }



    // Vista para el rol "Personal docente"
    static async getTeacherAcademicInfo(userId) {
        const [rows] = await pool.execute(

        `SELECT 
            c.name AS course_name,
            CONCAT(c.start_year, '-', c.end_year) AS academic_year,
            s.subject_id,
            s.class_group,
            s.name AS subject_name,
            sch.weekday AS day_of_week,
            sch.start_time,
            sch.end_time
        FROM teacher t
        JOIN subject s ON s.teacher_id = t.teacher_id
        JOIN course c ON c.course_id = s.course_id
        LEFT JOIN schedule sch ON sch.subject_id = s.subject_id
        WHERE t.user_id = ?
        
        `, [userId]);

        if (rows.length === 0) return null;

        const courseInfo = {
            course_name: rows[0].course_name,
            academic_year: rows[0].academic_year,
            subjects: [],
        };

        const subjects = {};

        for (const row of rows) {
            if (!subjects[row.subject_id]) {
                subjects[row.subject_id] = {
                    subject_id: row.subject_id,
                    subject_name: row.subject_name,
                    class_group: row.class_group,
                    schedule: []
                };
                courseInfo.subjects.push(subjects[row.subject_id]);
            }

            if (row.day_of_week && row.start_time && row.end_time) {
                subjects[row.subject_id].schedule.push({
                    day: row.day_of_week,
                    start: row.start_time,
                    end: row.end_time
                });
            }
        }

        return courseInfo;
    }

}

export default AcademicInfo;