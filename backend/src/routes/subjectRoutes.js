import express from "express";
import SubjectController from "../controllers/subjectController.js";

const router = express.Router();

router.get("/:teacherId/names", SubjectController.getDistinctSubjectNames);
router.get("/:teacherId/groups/:subjectName", SubjectController.getGroupsBySubjectAndTeacher);

export default router;
