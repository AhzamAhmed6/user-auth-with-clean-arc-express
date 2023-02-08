import Id from "../Id";

export default function makeUsersDb({ makeDb }) {
	return Object.freeze({
		findByEmail,
		insert,
		remove,
	});
	async function remove({ id: _id }) {
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

	async function insert({ id: _id = Id.makeId(), ...userInfo }) {
		const db = await makeDb();
		const result = await db
			.collection("users")
			.insertOne({ _id, ...userInfo });

		const userId = result.insertedId;
		const user = await db
			.collection("users")
			.find({ _id: userId })
			.toArray();
		const { _id: id, ...finalUser } = user[0];
		return { id, ...finalUser };
	}
}
