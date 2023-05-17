import usersDb from "../data-access/index.js";

function validateId({ id }) {
  if (!id) {
    throw Error("Plz provide Id");
  }
}

function makeFindUserById({ usersDb }) {
  return async function findUserById({ id }) {
    const exists = await usersDb.findById({ id: id });
    if (!exists) {
      throw new Error("User not found.");
    }
    return exists;
  };
}

function makeDeleteUser({ usersDb }) {
  return async function deleteUser({id}) {
    return await usersDb.remove({ id });
  };
}

const findUserById = makeFindUserById({ usersDb });
const deleteUser = makeDeleteUser({ usersDb });

const removeUserDependencies = { validateId, findUserById, deleteUser };

export default removeUserDependencies;
