export default function makeAddUser({
  makeUser,
  checkUserExists,
  formatUser,
  insertUser,
  handleError,
}) {
  return async function addUser(userInfo) {
    try {
      const user = makeUser(userInfo);

      await checkUserExists({ user });

      const formattedUser = await formatUser(user);
      return await insertUser(formattedUser);
    } catch (error) {
      handleError(error);
    }
  };
}
