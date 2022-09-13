import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import Debug from "debug";
import chalk from "chalk";
import { createClient } from "@supabase/supabase-js";
import CustomError from "../../utils/CustomError/CustomError";
import backupConectionData from "../../utils/supabaseBackup/backupConnectionData";

const debug = Debug("mahlzeit:server:middlewares:fileStorage");

const supabase = createClient(backupConectionData.url, backupConectionData.key);

const fileStorage = async (req: Request, res: Response, next: NextFunction) => {
  const newFileName = `${Date.now()}-${req.file.originalname
    .split(" ")
    .join("-")}`;

  await fs.rename(
    path.join("public", req.file.filename),
    path.join("public", newFileName)
  );

  debug(chalk.blue(`File ${req.file.filename} rename to ${newFileName}`));

  const filePath = path.join("public", newFileName);

  req.body.image = filePath;

  const file = await fs.readFile(filePath);

  const storage = supabase.storage.from("contazo-images");

  const uploadResult = await storage.upload(filePath, file);

  req.body.backupImage = storage.getPublicUrl(filePath).publicURL;

  if (uploadResult.error) {
    const fileError = new CustomError(
      400,
      uploadResult.error.message,
      "Error reading the file"
    );
    next(fileError);
    return;
  }

  debug(chalk.green("File uploaded sucessfully"));
  next();
};

export default fileStorage;
