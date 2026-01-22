import config from "./config/config";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.use("/user", userRoutes);

mongoose.connect(config.mongodbUri);

export default app;
