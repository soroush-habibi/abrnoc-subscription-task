import mongodb from 'mongodb';
import bcrypt from 'bcrypt';

interface user {
    _id: mongodb.ObjectId,
    username: string,
    password: string,
    credit: number
}

interface subscription {
    _id: mongodb.ObjectId
    name: string,
    price: number,
    userId: mongodb.ObjectId
}

interface invoice {
    _id: mongodb.ObjectId,
    userId: mongodb.ObjectId,
    subId: mongodb.ObjectId,
    startTime: Date,
    endTime?: Date
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

    static async registerUser(username: string, password: string): Promise<mongodb.ObjectId> {
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

        return result.insertedId;
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

    static async addSubscription(name: string, price: number, userId: string): Promise<mongodb.ObjectId> {
        if (name.length < 5) {
            throw new Error("Name should be bigger than 4 character");
        } else if (price < 0) {
            throw new Error("Price number should be positive");
        } else if (!mongodb.ObjectId.isValid(userId)) {
            throw new Error("User ID is not valid");
        }

        const result = await this.client.db("abrnoc").collection("subs").insertOne({
            name: name,
            price: price,
            userId: mongodb.ObjectId.createFromHexString(userId)
        });

        await this.addInvoice(String(result.insertedId), userId);

        return result.insertedId;
    }

    static async getSubscriptions(userId: string): Promise<subscription[]> {
        if (!mongodb.ObjectId.isValid(userId)) {
            throw new Error("User ID is not valid");
        }

        const subs = await this.client.db("abrnoc").collection<subscription>("subs").find({ userId: mongodb.ObjectId.createFromHexString(userId) }).toArray();

        return subs;
    }

    static async addInvoice(subId: string, userId: string) {
        if (!mongodb.ObjectId.isValid(subId) || !mongodb.ObjectId.isValid(userId)) {
            throw new Error("User ID or sub Id is not valid");
        }

        const result = await this.client.db("abrnoc").collection("invoice").insertOne({
            subId: mongodb.ObjectId.createFromHexString(subId),
            userId: mongodb.ObjectId.createFromHexString(userId),
            startTime: Date.now()
        });
        //todo:add timer job
    }
}