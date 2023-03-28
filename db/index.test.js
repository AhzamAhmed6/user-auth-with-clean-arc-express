import { makeDb } from "../src/data-access/index.js";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

describe("Database setup", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await makeDb({ connection });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create hash index", async () => {
    const result = await db
      .collection("users")
      .createIndexes([{ key: { hash: 1 }, name: "hash_idx" }]);
    expect(result).toBeDefined();
  });

  it("should create postId index", async () => {
    const result = await db
      .collection("users")
      .createIndexes([{ key: { postId: -1 }, name: "postId_idx" }]);
    expect(result).toBeDefined();
  });

  it("should create replyToId index", async () => {
    const result = await db
      .collection("users")
      .createIndexes([{ key: { replyToId: -1 }, name: "replyToId_idx" }]);
    expect(result).toBeDefined();
  });
});
