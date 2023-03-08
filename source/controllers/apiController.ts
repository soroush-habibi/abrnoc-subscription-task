import express from 'express';
import mongodb from 'mongodb';
import JWT from 'jsonwebtoken';

import db from '../models/db.js';

export default class controller {
    static register(req: express.Request, res: express.Response) {
        if (!req.body.username || !req.body.password) {
            res.status(400).json({
                success: false,
                body: null,
                message: "invalid input"
            });
            return;
        }

        db.connect((client) => {
            db.registerUser(req.body.username, req.body.password).then((value: mongodb.ObjectId) => {
                if (value) {
                    res.status(201).json({
                        success: true,
                        body: String(value),
                        message: "OK"
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "insertion failed"
                    });
                }
                client.close();
            }).catch((err: Error) => {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: err.message
                });
                client.close();
            });
        });
    }

    static login(req: express.Request, res: express.Response) {
        if (!req.query.username || !req.query.password) {
            res.status(400).json({
                success: false,
                body: null,
                message: "invalid input"
            });
            return;
        }

        db.connect((client) => {
            db.loginUser(decodeURIComponent(String(req.query.username)), decodeURIComponent(String(req.query.password))).then((value: mongodb.ObjectId) => {
                if (value) {
                    const token = JWT.sign({
                        username: decodeURIComponent(String(req.query.username)),
                        password: decodeURIComponent(String(req.query.password))
                    }, process.env.JWT_KEY || "testKey");

                    res.cookie("JWT", token, { httpOnly: true });

                    res.status(200).json({
                        success: true,
                        body: value,
                        message: "OK"
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "server error"
                    });
                }
            }).catch((err: Error) => {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: err.message
                });
                client.close();
            });
        });
    }
}