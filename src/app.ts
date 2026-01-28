import config from "./config/config";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";

const app = express();

app.use(express.json());

app.use("/user", userRoutes);
app.use("/book", bookRoutes);

mongoose.connect(config.mongodbUri);

export default app;
