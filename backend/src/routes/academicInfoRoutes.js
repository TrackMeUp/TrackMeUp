import express from "express";
import AcademicInfoController from "../controllers/academicInfoController.js";

const router = express.Router();

router.get("/:id/:rol", (req, res) =>
    AcademicInfoController.obtenerInformacionAcademica(req, res)
);

export default router;