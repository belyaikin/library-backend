import config from "./config/config.js";

import express from "express";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use("/book", bookRoutes);

mongoose.connect(config.mongodbUri);

export default app;
