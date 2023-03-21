export default function makeRemoveUser({ usersDb }) {
  return async function removeUser({ id, ...rest }) {
    const existist = await usersDb.findById({ id: id });
    if (!existist) {
      throw new Error("User not found.");
    }
    return await usersDb.remove({ id: id });
  };
}
