import path from "path";
import { Book } from "../models/book.js";
import { Response } from "express";
import config from "../config/config.js";
import fs from "fs";

export const createEpubReadStream = (book: Book, response: Response) => {
  const epubPath = path.join(config.epubLocation, book.epub);

  if (!fs.existsSync(epubPath)) {
    return response.status(404).json({ message: "EPUB file missing" });
  }

  response.setHeader("Content-Type", "application/epub+zip");
  response.setHeader(
    "Content-Disposition",
    `attachment; filename="${book.title}.epub"`,
  );

  fs.createReadStream(epubPath).pipe(response);
};
