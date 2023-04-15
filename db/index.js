import { makeDb } from "../src/data-access/index.js";
import dotenv from "dotenv";
import logger from "../src/logger/index.js";

dotenv.config();

(async function setupDb() {
  try {
    logger.info("Initiating database setup...");
    const db = await makeDb();
    const indexArr = [
      { key: { hash: 1 }, name: "hash_idx" },
      { key: { postId: -1 }, name: "postId_idx" },
      { key: { replyToId: -1 }, name: "replyToId_idx" },
    ];
    const result = await db.collection("users").createIndexes(indexArr);
    logger.info(`Indexes created successfully. Result: ${result}`);
    logger.info("Database setup has been successfully completed.");
    process.exit();
  } catch (error) {
    logger.error(
      `Database setup encountered an error and failed.\n\t\t${err.stack}`
    );
    process.exit(1);
  }
})();
