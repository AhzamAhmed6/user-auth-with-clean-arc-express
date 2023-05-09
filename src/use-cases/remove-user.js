export default function makeRemoveUser({ usersDb }) {
  return async function removeUser({ id }) {
    const existingUser = await findUserById(id, usersDb);
    validateUserExists(existingUser);
    return deleteUser(id, usersDb);
  };

  async function findUserById(id, usersDb) {
    return await usersDb.findById({ id });
  }

  function validateUserExists(user) {
    if (!user) {
      throw new Error("User not found.");
    }
  }

  async function deleteUser(id, usersDb) {
    return await usersDb.remove({ id });
  }
}
