import mongodb from 'mongodb';

export default class db {
    private static client: mongodb.MongoClient
    static async connect(func: (client: mongodb.MongoClient) => void) {
        this.client = await mongodb.MongoClient.connect(process.env.MONGO || "mongodb://127.0.0.1:27017");

        func(this.client);
    }
}