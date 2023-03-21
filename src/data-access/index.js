import dotenv from "dotenv";
import mongodb from "mongodb";
import makeUsersDb from "./user-db.js";

dotenv.config();
const MongoClient = mongodb.MongoClient;
const url = process.env.DM_USERS_DB_URL;
const dbName = process.env.DM_USERS_DB_NAME;
const client = new MongoClient(url, { useNewUrlParser: true });

export async function makeDb() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

const usersDb = makeUsersDb({ makeDb });
export default usersDb;
