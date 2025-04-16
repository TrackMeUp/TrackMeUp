import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => UserController.getUsers(req, res));
router.post("/", (req, res) => UserController.createUser(req, res));
router.put("/:id", (req, res) => UserController.updateUser(req, res));
router.delete("/:id", (req, res) => UserController.deleteUser(req, res));
router.post("/login", (req, res) => UserController.loginUser(req, res));

export default router;
