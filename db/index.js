import { makeDb } from "../src/data-access/index.js";
import dotenv from "dotenv";
import logger from "../src/logger.js";

dotenv.config();

(async function setupDb() {
  try {
    logger.info("Setting up database...");
    const db = await makeDb();
    const indexArr = [
      { key: { hash: 1 }, name: "hash_idx" },
      { key: { postId: -1 }, name: "postId_idx" },
      { key: { replyToId: -1 }, name: "replyToId_idx" },
    ];
    const result = await db.collection("users").createIndexes(indexArr);
    logger.info(result);
    logger.info("Database setup complete...");
    process.exit();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();
