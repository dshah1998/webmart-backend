import express, { Request, Response, NextFunction } from "express";
import { ValidationError } from 'express-validation';
import cors from "cors";
import multer from 'multer';
import compression from 'compression';
import cookieParser from "cookie-parser";

import { AppError } from './error';
import config from "./config";
import routes from "./route";

const app = express();

app.set("port", config.PORT);

app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));

app.use(multer().array('test')); // https://github.com/expressjs/multer
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));
app.use(compression()); // https://github.com/expressjs/compression#:~:text=express/-,connect,-When%20using%20this

app.use("/", routes());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err?.statusCode || 500).json({
        message: err?.message ?? 'Internal Server Error',
        code: err?.code ?? 'INTERNAL_SERVER_ERROR',
        ...(config?.isDev && { stack: err?.stack }),
      });
    }
  
    if (err instanceof ValidationError) {
      return res.status(err?.statusCode).json(err);
    }
  
    return res.status(500).json({
      message: err?.message ?? 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
      ...(config?.isDev && { stack: err?.stack }),
    });
  });

export default app;
