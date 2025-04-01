import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/login", (req, res) => userController.loginUser(req, res));

export default router;
