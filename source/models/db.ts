import mongodb from 'mongodb';
import bcrypt from 'bcrypt';

interface user {
    _id: mongodb.ObjectId,
    username: string,
    password: string,
    credit: number,
    subs: mongodb.ObjectId[]
}

export default class db {
    private static client: mongodb.MongoClient
    static async connect(func: (client: mongodb.MongoClient) => void) {
        this.client = await mongodb.MongoClient.connect(process.env.MONGO || "mongodb://127.0.0.1:27017");

        func(this.client);
    }

    static async existsUser(username: string): Promise<boolean> {
        const user = await this.client.db("abrnoc").collection("customer").countDocuments({ username: username });

        return user > 0 ? true : false;
    }

    static async registerUser(username: string, password: string): Promise<boolean> {
        if (username.length < 5) {
            throw new Error("Username should be bigger than 4 character");
        } else if (password.length < 5) {
            throw new Error("Password should be bigger than 4 character");
        } else if (await this.existsUser(username)) {
            throw new Error("This username already exists");
        }

        const result = await this.client.db("abrnoc").collection("customer").insertOne({
            username: username,
            password: bcrypt.hashSync(password, 10),
            credit: 100,
            subs: []
        });

        return result.acknowledged;
    }

    static async loginUser(username: string, password: string): Promise<mongodb.ObjectId> {
        if (username.length < 5) {
            throw new Error("Username should be bigger than 4 character");
        } else if (password.length < 5) {
            throw new Error("Password should be bigger than 4 character");
        }

        const user = await this.client.db("abrnoc").collection<user>("customer").findOne({ username: username });

        if (!user) {
            throw new Error("Can't find user");
        } else if (bcrypt.compareSync(password, user.password)) {
            return user._id;
        } else {
            throw new Error("Password is wrong");
        }
    }
}