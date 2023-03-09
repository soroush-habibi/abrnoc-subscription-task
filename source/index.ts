import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';

import apiRouter from './routers/apiRouter.js';
import viewRouter from './routers/viewRouter.js';

let temp: string[] = path.dirname(fileURLToPath(import.meta.url)).split('');
temp.splice(temp.length - 6);
const ROOT = temp.join('');
process.env.ROOT = ROOT;

const app = express();

app.use(express.json());
app.use(express.static("./public"));
app.use(cookieParser());

app.use("/api", apiRouter);
app.use("/", viewRouter);

app.listen(process.env.PORT || 3000);