export default function makeUsersDb({ makeDb }) {
	return Object.freeze({
		findByEmail,
		insert,
		remove,
	});
	async function remove({ _id: _id }) {
		const db = await makeDb();
		const result = await db.collection("users").deleteOne({ _id });
		return result.deletedCount;
	}

	async function findByEmail(user) {
		const db = await makeDb();
		const result = await db.collection("users").find({ email: user.email });
		const found = await result.toArray();
		if (found.length == 0) {
			return null;
		}
		const { _id: id, ...insertedInfo } = found[0];
		return { id, ...insertedInfo };
	}

	async function insert(userInfo) {
		const db = await makeDb();
		const result = await db.collection("users").insertOne(userInfo);
		const userId = result.insertedId;
		const user = await db
			.collection("users")
			.find({ _id: userId })
			.toArray();
		const finalUser = user[0];
		return finalUser;
	}
}
