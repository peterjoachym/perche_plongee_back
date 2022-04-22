require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mainRouter = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept, xsrf-token",
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use("/pictures/avatars", express.static("public/pictures/avatars"));
app.use("/pictures/club-events", express.static("public/pictures/club-events"));
app.use("/documents", express.static("public/documents"));

app.get("/", (req, res) => {
  res.status(200).json({ foo: "hello" });
});

app.use("/api", mainRouter);

module.exports = app;
