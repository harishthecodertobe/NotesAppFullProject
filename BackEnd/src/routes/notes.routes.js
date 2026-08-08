const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
    createNote,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote
} = require("../controllers/notes.controller");

router.post("/", authMiddleware, createNote);

router.get("/", authMiddleware, getAllNotes);

router.get("/:id", authMiddleware, getSingleNote);

router.put("/:id", authMiddleware, updateNote);

router.delete("/:id", authMiddleware, deleteNote);

module.exports = router;