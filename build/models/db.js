import mongodb from 'mongodb';
import bcrypt from 'bcrypt';
export default class db {
    static async connect(func) {
        this.client = await mongodb.MongoClient.connect(process.env.MONGO || "mongodb://127.0.0.1:27017");
        func(this.client);
    }
    static async existsUser(username) {
        const user = await this.client.db("abrnoc").collection("customer").countDocuments({ username: username });
        return user > 0 ? true : false;
    }
    static async registerUser(username, password) {
        if (username.length < 5) {
            throw new Error("Username should be bigger than 4 character");
        }
        else if (password.length < 5) {
            throw new Error("Password should be bigger than 4 character");
        }
        else if (await this.existsUser(username)) {
            throw new Error("This username already exists");
        }
        const result = await this.client.db("abrnoc").collection("customer").insertOne({
            username: username,
            password: bcrypt.hashSync(password, 10),
            credit: 100,
            subs: []
        });
        return result.insertedId;
    }
    static async loginUser(username, password) {
        if (username.length < 5) {
            throw new Error("Username should be bigger than 4 character");
        }
        else if (password.length < 5) {
            throw new Error("Password should be bigger than 4 character");
        }
        const user = await this.client.db("abrnoc").collection("customer").findOne({ username: username });
        if (!user) {
            throw new Error("Can't find user");
        }
        else if (bcrypt.compareSync(password, user.password)) {
            return user._id;
        }
        else {
            throw new Error("Password is wrong");
        }
    }
}
