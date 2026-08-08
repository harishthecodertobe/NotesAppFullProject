const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", authMiddleware, logoutUser);

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;