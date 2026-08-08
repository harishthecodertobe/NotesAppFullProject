const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const notesRoutes = require("./routes/notes.routes");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Serve React build
app.use(express.static(path.join(__dirname, "../../Client/client/dist")));

// React Routing
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../Client/client/dist/index.html")
  );
});

module.exports = app;