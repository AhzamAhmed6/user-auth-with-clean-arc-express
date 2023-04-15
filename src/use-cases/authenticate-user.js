export default function makeAuthenticateUser({ usersDb, verifyPassword }) {
  return async function authenticateUser({ email, password }) {
    try {
      const existingUserByEmail = await usersDb.findByEmail({
        email: email,
      });
      if (!existingUserByEmail) {
        throw new Error(
          "User not found. Please check the provided details and try again."
        );
      }
      const isPasswordMatch = await verifyPassword({
        password: password,
        hashedPassword: existingUserByEmail.hashedPassword,
      });
      if (!isPasswordMatch) {
        throw new Error("Incorrect password. Please try again.");
      }
      return existingUserByEmail;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      logger.error(
        `The authenticateUser function failed due to an error.\n\t\t${error.stack}`
      );
      throw new Error(
        "An error occurred while processing your request. Please try again later."
      );
    }
  };
}
