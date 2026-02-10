import path from "path";
import { Book } from "../models/book.js";
import { Response } from "express";
import config from "../config/config.js";
import fs from "fs";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
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

export const deleteEpubFile = (fileName: string) => {
  const epubPath = path.join(config.epubLocation, fileName);

  if (!fs.existsSync(epubPath)) {
    return;
  }

  fs.rm(epubPath, (err) => {
    if (err) {
      throw err;
    }
  });
};
