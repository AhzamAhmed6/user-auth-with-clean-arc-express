export default function makeDeleteUser({ usersDb }) {
  return async function deleteUser({ id, ...rest }) {
    const existist = await usersDb.findById({ id: id });
    if (!existist) {
      throw new Error("User not found.");
    }
    return await usersDb.remove({ id: id });
  };
}
