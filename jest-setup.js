import { join } from "path";

import { writeFileSync } from "fs";

const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;

const globalConfigPath = join(__dirname, "globalConfigMongo.json");

const mongod = new MongoMemoryServer({ autoStart: false });

export default async () => {
	if (!mongod.runningInstance) {
		await mongod.ensureInstance();
	}

	const mongoConfig = {
		mongoDBName: "jest",
		mongoUri: mongod.getUri(),
	};

	// Write global config to disk because all tests run in different contexts.
	writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));

	// Set reference to mongod in order to close the server during teardown.
	global.__MONGOD__ = mongod;
};
