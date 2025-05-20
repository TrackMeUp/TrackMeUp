import express from "express";
import Profile from "../controllers/profileController.js";
import ProfileController from "../controllers/profileController.js";

const router = express.Router();

router.get("/:id/:rol", (req, res) =>
    ProfileController.obtenerPerfil(req, res),
);

export default router;