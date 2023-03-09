import mongodb from 'mongodb';
import bcrypt from 'bcrypt';
import Nodeschedule from 'node-schedule';

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
    active: boolean
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

    static async getUser(username: string): Promise<user> {
        const user = await this.client.db("abrnoc").collection<user>("customer").findOne({ username: username });

        if (user) {
            return user;
        } else {
            throw new Error("Can't find user");
        }
    }

    static async existsSub(subId: string): Promise<boolean> {
        const sub = await this.client.db("abrnoc").collection("subs").countDocuments({ _id: mongodb.ObjectId.createFromHexString(subId) });

        return sub > 0 ? true : false;
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
            userId: mongodb.ObjectId.createFromHexString(userId),
            active: true
        });

        await this.addInvoice(String(result.insertedId), userId, price);

        return result.insertedId;
    }

    static async getSubscriptions(userId: string): Promise<subscription[]> {
        if (!mongodb.ObjectId.isValid(userId)) {
            throw new Error("User ID is not valid");
        }

        const subs = await this.client.db("abrnoc").collection<subscription>("subs").find({ userId: mongodb.ObjectId.createFromHexString(userId) }).toArray();

        return subs;
    }

    static async addInvoice(subId: string, userId: string, price: number) {
        if (!mongodb.ObjectId.isValid(subId) || !mongodb.ObjectId.isValid(userId)) {
            throw new Error("User ID or sub Id is not valid");
        } else if (price < 0) {
            throw new Error("Price should be a positive number");
        } if (!await this.existsSub(subId)) {
            throw new Error("Can't find sub id");
        }

        let timeNow = new Date();
        const { insertedId } = await this.client.db("abrnoc").collection("invoice").insertOne({
            userId: mongodb.ObjectId.createFromHexString(userId),
            subId: mongodb.ObjectId.createFromHexString(subId),
            price: price,
            startTime: timeNow
        });

        const timer = Nodeschedule.scheduleJob(new Date(timeNow.getTime() + (1000 * 10)), async () => {
            const sub = await this.client.db("abrnoc").collection<subscription>("subs").findOne({ _id: mongodb.ObjectId.createFromHexString(subId) });
            if (sub?.active) {
                const invoice = await this.client.db("abrnoc").collection("invoice").updateOne({
                    _id: insertedId
                }, {
                    $set: {
                        endTime: new Date()
                    }
                });

                if (invoice.matchedCount != 0) {
                    await this.creditReduction(userId, price);

                    await this.addInvoice(subId, userId, price);
                }
            } else {
                await this.deleteIncompleteInvoice(subId);
            }
        });
    }

    static async deleteIncompleteInvoice(subId: string): Promise<boolean> {
        if (!mongodb.ObjectId.isValid(subId)) {
            throw new Error("Sub ID is not valid");
        } if (!await this.existsSub(subId)) {
            throw new Error("Can't find sub id");
        }

        const result = await this.client.db("abrnoc").collection("invoice").deleteMany({
            subId: mongodb.ObjectId.createFromHexString(subId),
            endTime: { $exists: false }
        });

        return result.acknowledged;
    }

    static async creditReduction(userId: string, price: number): Promise<boolean> {
        if (!mongodb.ObjectId.isValid(userId)) {
            throw new Error("User ID is not valid");
        } else if (price < 0) {
            throw new Error("Price should be a positive number");
        }

        const result = await this.client.db("abrnoc").collection("customer").updateOne({
            _id: mongodb.ObjectId.createFromHexString(userId)
        }, {
            $inc: {
                credit: -price
            }
        });

        return result.modifiedCount == 1 ? true : false;
    }

    static async increaseCredit(userId: string, price: number): Promise<boolean> {
        if (!mongodb.ObjectId.isValid(userId)) {
            throw new Error("User ID is not valid");
        } else if (price < 0) {
            throw new Error("Price should be a positive number");
        }

        const result = await this.client.db("abrnoc").collection("customer").updateOne({
            _id: mongodb.ObjectId.createFromHexString(userId)
        }, {
            $inc: {
                credit: price
            }
        });

        return result.modifiedCount == 1 ? true : false;
    }

    static async deactiveSubscription(subId: string): Promise<boolean> {
        if (!mongodb.ObjectId.isValid(subId)) {
            throw new Error("Sub ID is not valid");
        } if (!await this.existsSub(subId)) {
            throw new Error("Can't find sub id");
        }

        const sub = await this.client.db("abrnoc").collection<subscription>("subs").findOne({ _id: mongodb.ObjectId.createFromHexString(subId) });

        if (!sub?.active) {
            throw new Error("This sub is already deactivated");
        }

        const result = await this.client.db("abrnoc").collection("subs").updateOne({
            _id: mongodb.ObjectId.createFromHexString(subId)
        }, {
            $set: {
                active: false
            }
        });

        await this.deleteIncompleteInvoice(subId);

        return result.acknowledged;
    }

    static async activeSubscription(subId: string): Promise<boolean> {
        if (!mongodb.ObjectId.isValid(subId)) {
            throw new Error("Sub ID is not valid");
        } if (!await this.existsSub(subId)) {
            throw new Error("Can't find sub id");
        }

        const sub = await this.client.db("abrnoc").collection<subscription>("subs").findOne({ _id: mongodb.ObjectId.createFromHexString(subId) });

        if (sub?.active) {
            throw new Error("This sub is already activated");
        }

        const result = await this.client.db("abrnoc").collection("subs").updateOne({
            _id: mongodb.ObjectId.createFromHexString(subId)
        }, {
            $set: {
                active: true
            }
        });

        if (sub) {
            await this.addInvoice(subId, String(sub.userId), sub.price);
        }

        return result.acknowledged;
    }
}