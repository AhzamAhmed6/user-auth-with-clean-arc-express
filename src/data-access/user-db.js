import Id from "../Id/index.js";

export default function makeUsersDb({ makeDb }) {
  const collectionName = "users";

  async function findById({ id }) {
    const db = await makeDb();
    const result = await db.collection(collectionName).findOne({ _id: id });

    if (!result) {
      return null;
    }

    const { _id, ...rest } = result;
    return { id: _id, ...rest };
  }

  async function updateName({ id, firstName, lastName, ...rest }) {
    const db = await makeDb();
    const result = await db
      .collection(collectionName)
      .updateOne({ _id: id }, { $set: { firstName, lastName } });

    if (result.modifiedCount === 0) {
      return null;
    }

    return { id, firstName, lastName, ...rest };
  }

  async function updatePassword({ id, hashedPassword, ...rest }) {
    const db = await makeDb();
    const result = await db
      .collection(collectionName)
      .updateOne({ _id: id }, { $set: { hashedPassword } });

    if (result.modifiedCount === 0) {
      return null;
    }

    return { id, hashedPassword, ...rest };
  }

  async function findAll() {
    const db = await makeDb();
    const results = await db.collection(collectionName).find({}).toArray();
    return results.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
  }

  async function remove({ id }) {
    const db = await makeDb();
    const result = await db.collection(collectionName).deleteOne({ _id: id });
    return result.deletedCount;
  }

  async function findByEmail({ email }) {
    const db = await makeDb();
    const result = await db.collection(collectionName).findOne({ email });

    if (!result) {
      return null;
    }

    const { _id, ...rest } = result;
    return { id: _id, ...rest };
  }

  async function insert({ id = Id.makeId(), ...rest }) {
    const db = await makeDb();
    const result = await db
      .collection(collectionName)
      .insertOne({ _id: id, ...rest });
    const inserted = await db
      .collection(collectionName)
      .findOne({ _id: result.insertedId });
    const { _id, ...final } = inserted;
    return { id: _id, ...final };
  }

  return Object.freeze({
    findById,
    updateName,
    updatePassword,
    findAll,
    remove,
    findByEmail,
    insert,
  });
}
