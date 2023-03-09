import JWT from 'jsonwebtoken';
import db from '../models/db.js';
export default class controller {
    static register(req, res) {
        if (!req.body.username || !req.body.password) {
            res.status(400).json({
                success: false,
                body: null,
                message: "invalid input"
            });
            return;
        }
        db.connect((client) => {
            db.registerUser(req.body.username, req.body.password).then((value) => {
                if (value) {
                    res.status(201).json({
                        success: true,
                        body: String(value),
                        message: "OK"
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "insertion failed"
                    });
                }
                client.close();
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: err.message
                });
                client.close();
            });
        });
    }
    static login(req, res) {
        if (!req.query.username || !req.query.password) {
            res.status(400).json({
                success: false,
                body: null,
                message: "invalid input"
            });
            return;
        }
        db.connect((client) => {
            db.loginUser(decodeURIComponent(String(req.query.username)), decodeURIComponent(String(req.query.password))).then((value) => {
                if (value) {
                    const token = JWT.sign({
                        id: String(value),
                        password: decodeURIComponent(String(req.query.password))
                    }, process.env.JWT_KEY || "testKey");
                    res.cookie("JWT", token, { httpOnly: true });
                    res.status(200).json({
                        success: true,
                        body: value,
                        message: "OK"
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "server error"
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: err.message
                });
                client.close();
            });
        });
    }
    static authentication(req, res, next) {
        const token = req.cookies.JWT;
        if (!token) {
            res.status(403).json({
                success: false,
                body: null,
                message: "Forbidden"
            });
        }
        else {
            const decode = JWT.verify(token, process.env.JWT_KEY || "testKey");
            if (decode instanceof Object) {
                res.locals.id = decode.id;
                res.locals.password = decode.password;
                next();
            }
            else {
                res.status(403).json({
                    success: false,
                    body: null,
                    message: "Forbidden"
                });
            }
        }
    }
    static subscribe(req, res) {
        if (!req.body.name || !req.body.price) {
            res.status(400).json({
                success: false,
                body: null,
                message: "invalid input"
            });
            return;
        }
        db.connect((client) => {
            db.addSubscription(req.body.name, Number(req.body.price), res.locals.id).then((value) => {
                if (value) {
                    res.status(201).json({
                        success: true,
                        body: String(value),
                        message: "OK"
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "insertion failed"
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            });
        });
    }
    static deactiveSub(req, res) {
        if (!req.body.subId) {
            res.status(400).json({
                success: false,
                body: null,
                message: "invalid input"
            });
            return;
        }
        db.connect((client) => {
            db.deactiveSubscription(req.body.subId).then((value) => {
                if (value) {
                    res.status(200).json({
                        success: true,
                        body: null,
                        message: "OK"
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "operation failed"
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            });
        });
    }
    static activeSub(req, res) {
        if (!req.body.subId) {
            res.status(400).json({
                success: false,
                body: null,
                message: "invalid input"
            });
            return;
        }
        db.connect((client) => {
            db.activeSubscription(req.body.subId).then((value) => {
                if (value) {
                    res.status(200).json({
                        success: true,
                        body: null,
                        message: "OK"
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "operation failed"
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            });
        });
    }
    static deleteSub(req, res) {
        if (!req.body.subId) {
            res.status(400).json({
                success: false,
                body: null,
                message: "invalid input"
            });
            return;
        }
        db.connect((client) => {
            db.deleteSub(req.body.subId).then((value) => {
                if (value) {
                    res.status(200).json({
                        success: true,
                        body: null,
                        message: "OK"
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "operation failed"
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: err.message
                });
            });
        });
    }
    static profile(req, res) {
        db.connect((client) => {
            db.getUser(res.locals.id).then((value) => {
                if (value) {
                    res.status(200).json({
                        success: true,
                        body: value,
                        message: "OK"
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "operation failed"
                    });
                }
                client.close();
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: err.message
                });
                client.close();
            });
        });
    }
    static getSubs(req, res) {
        db.connect((client) => {
            db.getSubscriptions(res.locals.id).then((value) => {
                if (value) {
                    res.status(200).json({
                        success: true,
                        body: value,
                        message: "OK"
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "operation failed"
                    });
                }
                client.close();
            }).catch((err) => {
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
