const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: userResponse
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            user: userResponse
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};

const logoutUser = (req, res) => {

    res.clearCookie("token");

    return res.status(200).json({
        success: true,
        message: "Logout Successful"
    });

};

// Used by the frontend on app load / page refresh to check if the auth
// cookie is still valid and to restore the logged-in user's session.
const getCurrentUser = (req, res) => {

    return res.status(200).json({
        success: true,
        user: req.user
    });

};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
};