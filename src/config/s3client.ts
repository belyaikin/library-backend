import { S3Client } from "@aws-sdk/client-s3";
import config from "./config.js";

const s3client = new S3Client({
  region: "auto",
  endpoint: config.bucket_storage_url,
  credentials: {
    accessKeyId: config.bucket_storage_access_key,
    secretAccessKey: config.bucket_storage_secret_key,
  },
});

export default s3client;
