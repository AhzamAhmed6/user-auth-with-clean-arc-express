import dotenv from "dotenv";
import mongodb from "mongodb";
import makeUsersDb from "./user-db.js";

dotenv.config();
const { MongoClient } = mongodb;
const url = process.env.DM_USERS_DB_URL;
const dbName = process.env.DM_USERS_DB_NAME;
const client = new MongoClient(url, { useNewUrlParser: true });
import logger from "../logger/index.js";

export async function makeDb() {
  try {
    if (!client.isConnected()) {
      await client.connect();
    }
    return client.db(dbName);
  } catch (error) {
    logger.error(
      `Failed to establish a connection with the database due to an unspecified error..\n\t\t${error.stack}`
    );
    throw new Error(
      "An error occurred while processing your request. Please try again later."
    );
  }
}

const usersDb = makeUsersDb({ makeDb });
export default usersDb;
