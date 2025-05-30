import express from "express";
import PerformanceController from "../controllers/performanceController.js";

const router = express.Router();

router.get("/student/:studentId", (req, res) => PerformanceController.getStudentPerformance(req, res));
router.get("/accessible-students", (req, res) => PerformanceController.getAccessibleStudents(req, res));
router.get("/subject-comparison/:subjectId", (req, res) => PerformanceController.getSubjectPerformanceComparison(req, res));

export default router;
