const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const notesRoutes = require("./routes/notes.routes");

const app = express();

// The frontend runs on a different origin (Vite dev server), so CORS with
// credentials must be enabled for the auth cookie to be sent/received.
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

module.exports = app;