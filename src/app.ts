import config from "./config/config";
import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

mongoose.connect(config.mongodbUri);

export default app;
