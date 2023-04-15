import makeUser from "../user/index.js";
import logger from "../logger/index.js";

export default function makeAddUser({ usersDb }) {
  return async function addUser(userInfo) {
    try {
      const user = makeUser(userInfo);

      const existingUserById = await usersDb.findById({ id: user.getId() });
      const existingUserByEmail = await usersDb.findByEmail({
        email: user.getEmail(),
      });

      if (existingUserById || existingUserByEmail) {
        throw new Error(
          "Unable to register user. The provided email address is already associated with an existing account."
        );
      }
      const newUser = {
        id: user.getId(),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        email: user.getEmail(),
        createdOn: user.getCreatedOn(),
        modifiedOn: user.getModifiedOn(),
        hashedPassword: await user.getHashedPassword(),
      };

      return usersDb.insert(newUser);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      logger.error(
        `The addUser function failed due to an error.\n\t\t${error.stack}`
      );
      throw new Error(
        "An error occurred while processing your request. Please try again later."
      );
    }
  };
}
