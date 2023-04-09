import { makeDb } from "../src/data-access/index.js";
import dotenv from "dotenv";

dotenv.config();

(async function setupDb() {
  try {
    console.log("Setting up database...");
    const db = await makeDb();
    const indexArr = [
      { key: { hash: 1 }, name: "hash_idx" },
      { key: { postId: -1 }, name: "postId_idx" },
      { key: { replyToId: -1 }, name: "replyToId_idx" },
    ];
    const result = await db.collection("users").createIndexes(indexArr);
    console.log(result);
    console.log("Database setup complete...");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
