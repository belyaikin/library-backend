import config from "./config/config.js";

import express from "express";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/author", authorRoutes);

// app.use("/api/epub", express.static(config.epubLocation));

app.use("/api/auth", authRoutes);

mongoose.connect(config.mongodbUri);

export default app;
