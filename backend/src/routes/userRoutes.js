const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", (req, res) => userController.loginUser(req, res));

module.exports = router;
