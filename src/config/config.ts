import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  environment: "dev" | "prod";
  mongodbUri: string;
  frontendUrl: string;
  epubLocation: string;

  access_token_secret: string;
  refresh_token_secret: string;
}

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw Error("MongoDB URI isn't specified in environment variables");
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  environment: process.env.ENVIRONMENT === "prod" ? "prod" : "dev",

  mongodbUri,
  frontendUrl: process.env.FRONTEND_URL || "*",

  epubLocation: process.env.EPUB_LOCATION || "epubs/",

  access_token_secret:
    process.env.ACCESS_TOKEN_SECRET || "PLEASECHANGEINPRODUCTION",
  refresh_token_secret:
    process.env.REFRESH_TOKEN_SECRET || "PLEASECHANGEINPRODUCTION",
};

export default config;
