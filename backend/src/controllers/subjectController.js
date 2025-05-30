import Subject from "../models/subject.js";

class SubjectController {
  static async getSubjects(req, res) {
    try {
      const subjects = await Subject.getAll();

      return res.status(200).json({
        success: true,
        subjects,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Could not fetch subjects",
        error: err.message,
      });
    }
  }

  static async getSubjectById(req, res) {
    try {
      const { id } = req.params;
      const subject = await Subject.getById(id);

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found",
        });
      }

      return res.status(200).json({
        success: true,
        subject,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Could not fetch subject",
        error: err.message,
      });
    }
  }

  static async createSubject(req, res) {
    try {
      const subject = await Subject.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Subject created",
        subject_id: subject.insertId,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Subject creation failed",
        error: err.message,
      });
    }
  }

  static async updateSubject(req, res) {
    try {
      const { id } = req.params;
      const updated = await Subject.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Subject not found or not updated",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Subject updated",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Subject update failed",
        error: err.message,
      });
    }
  }

  static async deleteSubject(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Subject.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Subject not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Subject deleted",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Subject deletion failed",
        error: err.message,
      });
    }
  }

  static async assignUserToSubject(req, res) {
    try {
      const { id } = req.params;
      const { role_id, role } = req.body;

      if (!role_id || !role) {
        return res.status(400).json({
          success: false,
          message: "role_id and role are required",
        });
      }

      if (!["teacher", "student"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be 'teacher' or 'student'",
        });
      }

      await Subject.assignUser(id, role_id, role);

      return res.status(200).json({
        success: true,
        message: `${role} assigned to subject successfully`,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "User assignment failed",
        error: err.message,
      });
    }
  }
}

export default SubjectController;
