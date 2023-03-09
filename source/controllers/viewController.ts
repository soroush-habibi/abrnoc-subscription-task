import express from 'express';
import JWT from 'jsonwebtoken';

export default class controller {
    static authentication(req: express.Request, res: express.Response, next: express.NextFunction) {
        const token = req.cookies.JWT;

        if (!token) {
            next();
        } else {
            try {
                const decode = JWT.verify(token, process.env.JWT_KEY || "testKey");

                if (decode instanceof Object) {
                    res.locals.id = decode.id;
                    res.locals.password = decode.password;
                    res.redirect("/app");
                }
            } catch (e) {
                next();
            }
        }
    }

    static loginPage(req: express.Request, res: express.Response) {
        res.sendFile(`${process.env.ROOT}/views/index.html`);
    }

    static appPage(req: express.Request, res: express.Response) {
        res.sendFile(`${process.env.ROOT}/views/app.html`);
    }
}