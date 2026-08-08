const Note = require("../models/note.model");

const createNote = async (req, res) => {
    try {

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const note = await Note.create({
            title,
            content,
            user: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            note
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

const getAllNotes = async (req, res) => {
    try {

        const notes = await Note.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: notes.length,
            notes
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

const getSingleNote = async (req, res) => {
    try {

        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            note
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

const updateNote = async (req, res) => {
    try {

        const { title, content } = req.body;

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            {
                title,
                content
            },
            {
                new: true
            }
        );

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

const deleteNote = async (req, res) => {
    try {

        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    createNote,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote
};