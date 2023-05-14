export default function makeAuthenticateUser({
  checkUserExists,
  matchPassword,
  handleError,
}) {
  return async function authenticateUser({ email, password }) {
    try {
      const existingUserByEmail = await checkUserExists({ email });

      await matchPassword({
        password,
        hashedPassword: existingUserByEmail.hashedPassword,
      });
      return existingUserByEmail;
    } catch (error) {
      handleError(error);
    }
  };
}
