import express from "express";
import Profile from "../controllers/profileController.js";
import ProfileController from "../controllers/profileController.js";

const router = express.Router();

router.get("/:id", ProfileController.obtenerPerfil);


export default router;