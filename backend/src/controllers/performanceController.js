import Performance from "../models/performance.js";

class PerformanceController {
  static async getStudentPerformance(req, res) {
    try {
      const { studentId } = req.params;
      const { subjectId } = req.query;

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const performanceData = subjectId
        ? await Performance.getStudentPerformanceBySubject(studentId, subjectId)
        : await Performance.getStudentPerformance(studentId);

      return res.status(200).json({
        success: true,
        data: performanceData,
      });
    } catch (err) {
      console.error("Performance fetch error:", err);
      return res.status(500).json({
        success: false,
        message: "Could not fetch student performance",
        error: err.message,
      });
    }
  }

  static async getAccessibleStudents(req, res) {
    try {
      const { userId, role } = req.query;

      if (!userId || !role) {
        return res.status(400).json({
          success: false,
          message: "User ID and role are required",
        });
      }

      let students = [];

      if (role === "admin") {
        students = await Performance.getAllStudents();
      } else if (role === "teacher") {
        students = await Performance.getTeacherStudents(userId);
      } else if (role === "student") {
        students = [{ user_id: parseInt(userId) }];
      } else if (role === "parent") {
        students = await Performance.getParentStudents(userId);
      } else {
        return res.status(403).json({
          success: false,
          message: "Invalid role or insufficient permissions",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          students: students,
        },
      });
    } catch (err) {
      console.error("Students fetch error:", err);
      return res.status(500).json({
        success: false,
        message: "Could not fetch accessible students",
        error: err.message,
      });
    }
  }

  static async getSubjectPerformanceComparison(req, res) {
    try {
      const { subjectId } = req.params;

      if (!subjectId) {
        return res.status(400).json({
          success: false,
          message: "Subject ID is required",
        });
      }

      const comparisonData = await Performance.getSubjectComparison(subjectId);

      return res.status(200).json({
        success: true,
        data: comparisonData,
      });
    } catch (err) {
      console.error("Subject comparison error:", err);
      return res.status(500).json({
        success: false,
        message: "Could not fetch subject performance comparison",
        error: err.message,
      });
    }
  }
}

export default PerformanceController;
