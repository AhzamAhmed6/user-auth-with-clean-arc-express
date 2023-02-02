export default async function ({ watch, watchAll } = {}) {
	if (!watch && !watchAll) {
		await global.__MONGOD__.stop();
	}
}
