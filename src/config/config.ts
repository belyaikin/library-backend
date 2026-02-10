import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  environment: "dev" | "prod";
  mongodbUri: string;
  frontendUrl: string;

  bucket_storage_url: string;
  bucket_storage_access_key: string;
  bucket_storage_secret_key: string;
  bucket_name: string;

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

  bucket_storage_url: process.env.BUCKET_STORAGE_URL || "",
  bucket_storage_access_key: process.env.BUCKET_STORAGE_ACCESS_KEY || "",
  bucket_storage_secret_key: process.env.BUCKET_STORAGE_SECRET_KEY || "",
  bucket_name: process.env.BUCKET_NAME || "",

  access_token_secret:
    process.env.ACCESS_TOKEN_SECRET || "PLEASECHANGEINPRODUCTION",
  refresh_token_secret:
    process.env.REFRESH_TOKEN_SECRET || "PLEASECHANGEINPRODUCTION",
};

export default config;
