import express from "express";
import AnnouncementsController from "../controllers/announcementsController.js";

const router = express.Router();

router.get("/:id/:rol", (req, res) =>
    AnnouncementsController.obtenerTablonAnuncios(req, res)
);

export default router;