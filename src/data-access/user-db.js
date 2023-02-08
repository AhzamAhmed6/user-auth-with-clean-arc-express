import Id from "../Id";

export default function makeUsersDb({ makeDb }) {
	return Object.freeze({
		findAll,
		findById,
		findByEmail,
		insert,
		remove,
		updateName,
	});
	async function findById({ id: _id }) {
		const db = await makeDb();
		const result = await db.collection("users").find({ _id });
		const found = await result.toArray();
		if (found.length === 0) {
			return null;
		}
		const { _id: id, ...info } = found[0];
		return { id, ...info };
	}

	async function updateName({ id: _id, firstName, lastName, ...userInfo }) {
		const db = await makeDb();
		const result = await db
			.collection("users")
			.updateOne({ _id }, { $set: { firstName, lastName } });
		return result.modifiedCount > 0
			? { id: _id, firstName, lastName, ...userInfo }
			: null;
	}

	async function findAll() {
		const db = await makeDb();
		const result = await db.collection("users").find({});
		return (await result.toArray()).map(({ _id: id, ...found }) => ({
			id,
			...found,
		}));
	}

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
