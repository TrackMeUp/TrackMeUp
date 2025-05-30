import Course from "../models/course.js";

class CourseController {
  static async getCourses(req, res) {
    try {
      const courses = await Course.getAll();

      return res.status(200).json({
        success: true,
        courses,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Could not fetch courses",
        error: err.message,
      });
    }
  }

  static async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.getById(id);

      return res.status(200).json({
        success: true,
        course,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Could not fetch course",
        error: err.message,
      });
    }
  }

  static async createCourse(req, res) {
    try {
      const course = await Course.create(req.body);

      return res.status(200).json({
        success: true,
        message: "Course created",
        user_id: course.insertId,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Course creation failed",
        error: err.message,
      });
    }
  }

  static async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const updated = await Course.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Course not found or not updated",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Course updated",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Course update failed",
        error: err.message,
      });
    }
  }

  static async deleteCourse(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Course.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Course deleted",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Course deletion failed",
        error: err.message,
      });
    }
  }
}

export default CourseController;
