import express from "express";
import SubjectController from "../controllers/subjectController.js";

const router = express.Router();

router.get("/", (req, res) => SubjectController.getSubjects(req, res));
router.get("/:id", (req, res) => SubjectController.getSubjectById(req, res));
router.post("/", (req, res) => SubjectController.createSubject(req, res));
router.put("/:id", (req, res) => SubjectController.updateSubject(req, res));
router.delete("/:id", (req, res) => SubjectController.deleteSubject(req, res));
router.put("/:id/assignuser", (req, res) => SubjectController.assignUserToSubject(req, res));
router.get("/teacher/:teacherId", (req, res) => SubjectController.getSubjectsByTeacherId(req, res));
router.get("/:teacherId/names", SubjectController.getDistinctSubjectNames);
router.get("/:teacherId/groups/:subjectName", SubjectController.getGroupsBySubjectAndTeacher);

export default router;
