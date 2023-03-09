import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routers/apiRouter.js';
import viewRouter from './routers/viewRouter.js';
import db from './models/db.js';
let temp = path.dirname(fileURLToPath(import.meta.url)).split('');
temp.splice(temp.length - 6);
const ROOT = temp.join('');
process.env.ROOT = ROOT;
const app = express();
app.use(express.json());
app.use(express.static("./public"));
app.use(cookieParser());
app.use("/api", apiRouter);
app.use("/", viewRouter);
//deactive all active subs in database when system starts
db.connect(async (client) => {
    console.log("Initializing database...");
    await db.initializeDB();
    client.close();
    app.listen(process.env.PORT || 3000, () => {
        console.log(`App is running on port ${process.env.PORT || 3000}`);
    });
}).catch((e) => {
    console.log("Mongodb is not running on port 27017");
    process.exit(1);
});
