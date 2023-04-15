import makeUser from "../user/index.js";
import logger from "../logger/index.js";

export default function makeAddUser({ usersDb }) {
  return async function addUser(userInfo) {
    const user = makeUser(userInfo);

    try {
      const existingUserById = await usersDb.findById({ id: user.getId() });
      const existingUserByEmail = await usersDb.findByEmail({
        email: user.getEmail(),
      });

      if (existingUserById || existingUserByEmail) {
        throw new Error("User already registered");
      }

      // continue with the rest of the code here
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !== "User already registered"
      ) {
        // log the error to the log files
        logger.error(
          `An error occurred while attempting to find a user in the database during signup. \n\t\t${err.stack}`
        );
        throw new Error("Something went wrong");
      } else {
        // send the error message to the user
        throw new Error(error.message);
      }
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
  };
}
