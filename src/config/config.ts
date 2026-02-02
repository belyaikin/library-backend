import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  environment: "dev" | "prod";
  mongodbUri: string;
  epubLocation: string;
}

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw Error("MongoDB URI isn't specified in environment variables");
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  environment: process.env.ENVIRONMENT === "prod" ? "prod" : "dev",
  mongodbUri,
  epubLocation: process.env.EPUB_LOCATION || "epubs/",
};

export default config;
