import mongodb from 'mongodb';
export default class db {
    static async connect(func) {
        this.client = await mongodb.MongoClient.connect(process.env.MONGO || "mongodb://127.0.0.1:27017");
        func(this.client);
    }
}
