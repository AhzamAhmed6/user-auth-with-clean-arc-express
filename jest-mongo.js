import dotenv from "dotenv";
import { readFileSync } from "fs";
import NodeEnvironment from "jest-environment-node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const globalConfigPath = path.join(__dirname, "globalConfigMongo.json");
dotenv.config({ path: ".env.test" });
export default class MongoEnvironment extends NodeEnvironment.TestEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    const globalConfig = JSON.parse(readFileSync(globalConfigPath, "utf-8"));

    this.global.__MONGO_URI__ = globalConfig.mongoUri;
    this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName;

    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}
