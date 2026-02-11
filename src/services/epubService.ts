import path from "path";
import { Book } from "../models/book.js";
import { Response } from "express";
import config from "../config/config.js";
import fs from "fs";
import { DeleteObjectCommand, GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import s3client from "../config/s3client.js";
import { Readable } from "stream";

export const createEpubReadStream = async (book: Book, response: Response) => {
  const command = new GetObjectCommand({
    Bucket: config.bucket_name,
    Key: book.epub,
  });

  try {
    const bucketResponse = await s3client.send(command);

    const s3Stream = bucketResponse.Body as Readable;

    response.setHeader("Content-Type", "application/epub+zip");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(book.title)}.epub"`,
    );

    return s3Stream.pipe(response);
  } catch (error) {
    console.error("S3 Error:", error);
    if (!response.headersSent) {
      response.status(404).send("File not found");
    }
  }
};

export const deleteEpubFile = async (fileName: string) => {
  const command = new DeleteObjectCommand({
    Bucket: config.bucket_name,
    Key: fileName,
  });

  return await s3client.send(command);
};
