import makeUser from "../user/index.js";
import logger from "../logger/index.js";

export default function makeAddUser({ usersDb }) {
  return async function addUser(userInfo) {
    try {
      const user = makeUser(userInfo);

      await checkUserExists(user, usersDb);

      const formattedUser = await formatUser(user);

      return usersDb.insert(formattedUser);
    } catch (error) {
      handleError(error);
    }
  };

  async function checkUserExists(user, usersDb) {
    const existingUserById = await usersDb.findById({ id: user.getId() });
    const existingUserByEmail = await usersDb.findByEmail({
      email: user.getEmail(),
    });

    if (existingUserById || existingUserByEmail) {
      throw new Error(
        "Unable to register user. The provided email address is already associated with an existing account."
      );
    }
  }

  async function formatUser(user) {
    return {
      id: user.getId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: user.getEmail(),
      createdOn: user.getCreatedOn(),
      modifiedOn: user.getModifiedOn(),
      hashedPassword: await user.getHashedPassword(),
    };
  }

  function handleError(error) {
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
}
