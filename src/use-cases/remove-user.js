export default function makeRemoveUser({
  validateId,
  findUserById,
  deleteUser,
}) {
  return async function removeUser({ id }) {
    validateId({ id });
    await findUserById(id);
    return deleteUser(id);
  };
}
