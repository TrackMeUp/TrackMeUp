import pool from "../db/connection.js";

class Performance {
  static async getStudentPerformance(studentUserId) {
    return this.getStudentPerformanceBySubject(studentUserId, null);
  }

  static async getStudentPerformanceBySubject(studentUserId, subjectId = null) {
    const connection = await pool.getConnection();
    try {
      const [studentRows] = await connection.execute(
        "SELECT student_id FROM student WHERE user_id = ?",
        [studentUserId],
      );

      if (studentRows.length === 0) {
        throw new Error("Student not found");
      }

      const studentId = studentRows[0].student_id;

      const [studentInfo] = await connection.execute(
        `
        SELECT u.user_id, u.first_name, u.last_name1, u.last_name2, u.email
        FROM user u
        JOIN student s ON u.user_id = s.user_id
        WHERE s.student_id = ?
      `,
        [studentId],
      );

      let submissionQuery = `
        SELECT 
          sub.submission_id,
          sub.grade,
          sub.status,
          sub.submission_date,
          sub.start_date,
          a.activity_id,
          a.title as activity_title,
          a.type as activity_type,
          a.start_date as activity_start,
          a.end_date as activity_end,
          s.subject_id,
          s.name as subject_name,
          s.class_group,
          c.name as course_name
        FROM submission sub
        JOIN activity a ON sub.activity_id = a.activity_id
        JOIN subject s ON a.subject_id = s.subject_id
        JOIN course c ON s.course_id = c.course_id
        WHERE sub.student_id = ?
      `;

      let queryParams = [studentId];

      if (subjectId) {
        submissionQuery += " AND s.subject_id = ?";
        queryParams.push(subjectId);
      }

      submissionQuery += " ORDER BY a.start_date DESC";

      const [submissions] = await connection.execute(
        submissionQuery,
        queryParams,
      );

      const [subjects] = await connection.execute(
        `
        SELECT 
          s.subject_id,
          s.name as subject_name,
          s.class_group,
          c.name as course_name,
          u.first_name as teacher_first_name,
          u.last_name1 as teacher_last_name1,
          u.last_name2 as teacher_last_name2
        FROM student_subject ss
        JOIN subject s ON ss.subject_id = s.subject_id
        JOIN course c ON s.course_id = c.course_id
        JOIN teacher t ON s.teacher_id = t.teacher_id
        JOIN user u ON t.user_id = u.user_id
        WHERE ss.student_id = ?
        ORDER BY s.name
      `,
        [studentId],
      );

      const subjectsForCalculation = subjectId
        ? subjects.filter((s) => s.subject_id === parseInt(subjectId))
        : subjects;

      const performanceData = this.calculatePerformanceMetrics(
        submissions,
        subjectsForCalculation,
      );

      return {
        student: studentInfo[0],
        subjects: subjects,
        submissions: submissions,
        performance: performanceData,
        filtered_subject_id: subjectId ? parseInt(subjectId) : null,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getTeacherStudents(teacherUserId) {
    try {
      const [students] = await pool.execute(
        `
        SELECT DISTINCT
          u.user_id,
          u.first_name,
          u.last_name1,
          u.last_name2,
          s.subject_id,
          s.name as subject_name
        FROM user u
        JOIN student st ON u.user_id = st.user_id
        JOIN student_subject ss ON st.student_id = ss.student_id
        JOIN subject s ON ss.subject_id = s.subject_id
        JOIN teacher t ON s.teacher_id = t.teacher_id
        WHERE t.user_id = ?
        ORDER BY u.first_name, u.last_name1
      `,
        [teacherUserId],
      );

      const uniqueStudents = [];
      const seenStudents = new Set();

      for (const student of students) {
        const studentKey = student.user_id;
        if (!seenStudents.has(studentKey)) {
          seenStudents.add(studentKey);
          uniqueStudents.push({
            user_id: student.user_id,
            first_name: student.first_name,
            last_name1: student.last_name1,
            last_name2: student.last_name2,
          });
        }
      }

      return uniqueStudents;
    } catch (error) {
      throw error;
    }
  }

  static async getParentStudents(parentUserId) {
    try {
      const [students] = await pool.execute(
        `
        SELECT 
          u.user_id,
          u.first_name,
          u.last_name1,
          u.last_name2,
          u.email
        FROM user u
        JOIN student s ON u.user_id = s.user_id
        JOIN parent p ON s.student_id = p.student_id
        WHERE p.user_id = ?
        ORDER BY u.first_name, u.last_name1
      `,
        [parentUserId],
      );

      return students;
    } catch (error) {
      console.error("Parent students query error:", error);
      throw error;
    }
  }

  static async getAllStudents() {
    try {
      const [students] = await pool.execute(`
        SELECT 
          u.user_id,
          u.first_name,
          u.last_name1,
          u.last_name2,
          u.email
        FROM user u
        JOIN student s ON u.user_id = s.user_id
        ORDER BY u.first_name, u.last_name1
      `);

      return students;
    } catch (error) {
      throw error;
    }
  }

  static calculatePerformanceMetrics(submissions, subjects) {
    const gradedSubmissions = submissions.filter((s) => s.grade !== null);
    const totalSubmissions = submissions.length;
    const completedSubmissions = submissions.filter(
      (s) => s.status === "completed",
    ).length;
    const pendingSubmissions = submissions.filter(
      (s) => s.status === "pending",
    ).length;
    const inProgressSubmissions = submissions.filter(
      (s) => s.status === "in_progress",
    ).length;

    const overallAverage =
      gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) /
          gradedSubmissions.length
        : 0;

    const subjectPerformance = {};
    subjects.forEach((subject) => {
      const subjectSubmissions = submissions.filter(
        (s) => s.subject_id === subject.subject_id,
      );
      const subjectGraded = subjectSubmissions.filter((s) => s.grade !== null);

      subjectPerformance[subject.subject_id] = {
        subject_name: subject.subject_name,
        course_name: subject.course_name,
        total_activities: subjectSubmissions.length,
        completed: subjectSubmissions.filter((s) => s.status === "completed")
          .length,
        pending: subjectSubmissions.filter((s) => s.status === "pending")
          .length,
        average_grade:
          subjectGraded.length > 0
            ? subjectGraded.reduce((sum, s) => sum + s.grade, 0) /
              subjectGraded.length
            : 0,
        grades: subjectGraded.map((s) => ({
          grade: s.grade,
          activity_title: s.activity_title,
          activity_type: s.activity_type,
          submission_date: s.submission_date,
        })),
      };
    });

    const examSubmissions = gradedSubmissions.filter(
      (s) => s.activity_type === "exam",
    );
    const assignmentSubmissions = gradedSubmissions.filter(
      (s) => s.activity_type === "assignment",
    );

    const examAverage =
      examSubmissions.length > 0
        ? examSubmissions.reduce((sum, s) => sum + s.grade, 0) /
          examSubmissions.length
        : 0;

    const assignmentAverage =
      assignmentSubmissions.length > 0
        ? assignmentSubmissions.reduce((sum, s) => sum + s.grade, 0) /
          assignmentSubmissions.length
        : 0;

    const timeAnalytics = this.calculateTimeAnalytics(submissions);

    const gradeRanges = {
      "9.0-10.0": gradedSubmissions.filter((s) => s.grade >= 9.0).length,
      "8.0-8.9": gradedSubmissions.filter(
        (s) => s.grade >= 8.0 && s.grade < 9.0,
      ).length,
      "7.0-7.9": gradedSubmissions.filter(
        (s) => s.grade >= 7.0 && s.grade < 8.0,
      ).length,
      "6.0-6.9": gradedSubmissions.filter(
        (s) => s.grade >= 6.0 && s.grade < 7.0,
      ).length,
      "0.0-5.9": gradedSubmissions.filter((s) => s.grade < 6.0).length,
    };

    const gradeTrends = this.calculateGradeTrends(gradedSubmissions);
    const completionAnalysis = this.calculateCompletionAnalysis(submissions);

    return {
      overall: {
        total_submissions: totalSubmissions,
        completed_submissions: completedSubmissions,
        pending_submissions: pendingSubmissions,
        in_progress_submissions: inProgressSubmissions,
        completion_rate:
          totalSubmissions > 0
            ? (completedSubmissions / totalSubmissions) * 100
            : 0,
        overall_average: Math.round(overallAverage * 100) / 100,
      },
      by_subject: subjectPerformance,
      by_type: {
        exams: {
          count: examSubmissions.length,
          average: Math.round(examAverage * 100) / 100,
        },
        assignments: {
          count: assignmentSubmissions.length,
          average: Math.round(assignmentAverage * 100) / 100,
        },
      },
      grade_distribution: gradeRanges,
      time_analytics: timeAnalytics,
      grade_trends: gradeTrends,
      completion_analysis: completionAnalysis,
      latest_submissions: submissions.slice(0, 10),
    };
  }

  static calculateTimeAnalytics(submissions) {
    const submittedActivities = submissions.filter(
      (s) => s.submission_date && s.activity_end,
    );

    const timingAnalysis = {
      early: 0,
      on_time: 0,
      late: 0,
      average_days_before_deadline: 0,
      punctuality_score: 0,
    };

    let totalDaysBeforeDeadline = 0;

    submittedActivities.forEach((submission) => {
      const submissionDate = new Date(submission.submission_date);
      const deadlineDate = new Date(submission.activity_end);
      const daysDifference = Math.ceil(
        (deadlineDate - submissionDate) / (1000 * 60 * 60 * 24),
      );

      if (daysDifference > 1) {
        timingAnalysis.early++;
      } else if (daysDifference >= 0) {
        timingAnalysis.on_time++;
      } else {
        timingAnalysis.late++;
      }

      totalDaysBeforeDeadline += daysDifference;
    });

    if (submittedActivities.length > 0) {
      timingAnalysis.average_days_before_deadline =
        totalDaysBeforeDeadline / submittedActivities.length;
      timingAnalysis.punctuality_score =
        ((timingAnalysis.early + timingAnalysis.on_time) /
          submittedActivities.length) *
        100;
    }

    const weeklyPatterns = this.calculateWeeklyPatterns(submittedActivities);

    const monthlyTrends = this.calculateMonthlyActivityTrends(submissions);

    return {
      timing_analysis: timingAnalysis,
      weekly_patterns: weeklyPatterns,
      monthly_trends: monthlyTrends,
      procrastination_risk:
        timingAnalysis.punctuality_score < 60
          ? "high"
          : timingAnalysis.punctuality_score < 80
            ? "medium"
            : "low",
    };
  }

  static calculateWeeklyPatterns(submissions) {
    const weekdays = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const patterns = {};

    weekdays.forEach((day) => (patterns[day] = 0));

    submissions.forEach((submission) => {
      if (submission.submission_date) {
        const date = new Date(submission.submission_date);
        const dayName = weekdays[date.getDay()];
        patterns[dayName]++;
      }
    });

    return patterns;
  }

  static calculateMonthlyActivityTrends(submissions) {
    const monthlyData = {};
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthKey] = {
        submitted: 0,
        graded: 0,
        total_grade: 0,
        average_grade: 0,
        completion_rate: 0,
      };
    }

    submissions.forEach((submission) => {
      if (submission.activity_start) {
        const date = new Date(submission.activity_start);
        const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;

        if (monthlyData[monthKey]) {
          if (submission.status === "completed") {
            monthlyData[monthKey].submitted++;
          }

          if (submission.grade !== null) {
            monthlyData[monthKey].graded++;
            monthlyData[monthKey].total_grade += submission.grade;
          }
        }
      }
    });

    Object.keys(monthlyData).forEach((month) => {
      const data = monthlyData[month];
      if (data.graded > 0) {
        data.average_grade = data.total_grade / data.graded;
      }
      const monthSubmissions = submissions.filter((s) => {
        if (s.activity_start) {
          const date = new Date(s.activity_start);
          const subMonthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
          return subMonthKey === month;
        }
        return false;
      });

      if (monthSubmissions.length > 0) {
        data.completion_rate = (data.submitted / monthSubmissions.length) * 100;
      }
    });

    return monthlyData;
  }

  static calculateGradeTrends(gradedSubmissions) {
    if (gradedSubmissions.length === 0) return [];

    const sortedSubmissions = gradedSubmissions
      .filter((s) => s.submission_date)
      .sort(
        (a, b) => new Date(a.submission_date) - new Date(b.submission_date),
      );

    const trends = [];
    const windowSize = 5;

    for (let i = windowSize - 1; i < sortedSubmissions.length; i++) {
      const window = sortedSubmissions.slice(i - windowSize + 1, i + 1);
      const average =
        window.reduce((sum, s) => sum + s.grade, 0) / window.length;

      trends.push({
        date: sortedSubmissions[i].submission_date,
        moving_average: Math.round(average * 100) / 100,
        activity_title: sortedSubmissions[i].activity_title,
        grade: sortedSubmissions[i].grade,
      });
    }

    return trends;
  }

  static calculateCompletionAnalysis(submissions) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentSubmissions = submissions.filter((s) => {
      if (s.activity_start) {
        const activityDate = new Date(s.activity_start);
        return activityDate >= thirtyDaysAgo;
      }
      return false;
    });

    const overdueSubmissions = submissions.filter((s) => {
      if (s.activity_end && s.status !== "completed") {
        const deadline = new Date(s.activity_end);
        return deadline < now;
      }
      return false;
    });

    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = submissions.filter((s) => {
      if (s.activity_end && s.status !== "completed") {
        const deadline = new Date(s.activity_end);
        return deadline >= now && deadline <= sevenDaysFromNow;
      }
      return false;
    });

    const grades = submissions
      .filter((s) => s.grade !== null)
      .map((s) => s.grade);
    let consistency = 0;
    if (grades.length > 1) {
      const mean =
        grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
      const variance =
        grades.reduce((sum, grade) => sum + Math.pow(grade - mean, 2), 0) /
        grades.length;
      consistency = Math.sqrt(variance);
    }

    return {
      recent_activity_count: recentSubmissions.length,
      overdue_count: overdueSubmissions.length,
      upcoming_deadlines: upcomingDeadlines.length,
      grade_consistency: Math.round(consistency * 100) / 100,
      performance_stability:
        consistency < 1 ? "stable" : consistency < 2 ? "moderate" : "unstable",
      recent_submissions: recentSubmissions.slice(0, 5),
      overdue_activities: overdueSubmissions.slice(0, 5),
      upcoming_activities: upcomingDeadlines.slice(0, 5),
    };
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
}

export default Performance;
