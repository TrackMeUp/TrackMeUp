import express from "express";
import CreateActivityController from "../controllers/createActivityController.js";

const router = express.Router();

router.post("/", CreateActivityController.createActivity);

export default router;
