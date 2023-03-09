import JWT from 'jsonwebtoken';
export default class controller {
    static authentication(req, res, next) {
        const token = req.cookies.JWT;
        if (!token) {
            next();
        }
        else {
            const decode = JWT.verify(token, process.env.JWT_KEY || "testKey");
            if (decode instanceof Object) {
                res.locals.id = decode.id;
                res.locals.password = decode.password;
                res.redirect("/app");
            }
            else {
                next();
            }
        }
    }
    static loginPage(req, res) {
        res.sendFile(`${process.env.ROOT}/views/index.html`);
    }
    static appPage(req, res) {
        res.sendFile(`${process.env.ROOT}/views/app.html`);
    }
}
