import 'dotenv/config';
import express from 'express';

import apiRouter from './routers/apiRouter.js';

const app = express();

app.use(express.json());
app.use(express.static("./public"));

app.use("/api", apiRouter);

app.listen(process.env.PORT || 3000);