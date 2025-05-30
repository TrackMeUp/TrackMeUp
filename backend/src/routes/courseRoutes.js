import express from "express";
import CourseController from "../controllers/courseController.js";

const router = express.Router();

router.get("/", (req, res) => CourseController.getCourses(req, res));
router.get("/:id", (req, res) => CourseController.getCourseById(req, res));
router.post("/", (req, res) => CourseController.createCourse(req, res));
router.put("/:id", (req, res) => CourseController.updateCourse(req, res));
router.delete("/:id", (req, res) => CourseController.deleteCourse(req, res));

export default router;
