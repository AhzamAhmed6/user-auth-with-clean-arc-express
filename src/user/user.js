import logger from "../logger/index.js";

export default function buildMakeUser({ Id, hashPassword }) {
  return function makeUser({
    id = Id.makeId(),
    firstName,
    lastName,
    email,
    password,
    modifiedOn = new Date(Date.now()).toUTCString(),
    createdOn = new Date(Date.now()).toUTCString(),
  }) {
    try {
      if (!Id.isValidId(id)) {
        throw new Error("The user ID provided is not valid");
      }
      if (![firstName, lastName, email, password].every(Boolean)) {
        throw new Error(
          "All fields are required. Please provide complete information for the user"
        );
      }
      if (!isValidEmail(email)) {
        throw new Error(`${email} is not a valid email`);
      }

      if (!isValidPassword(password)) {
        const errorMessage =
          "The password must be at least 8 characters long and include at least one symbol, uppercase letter, lowercase letter, and number.";
        throw new Error(errorMessage);
      }

      return Object.freeze({
        getId: () => id,
        getFirstName: () => firstName,
        getLastName: () => lastName,
        getEmail: () => email,
        getModifiedOn: () => modifiedOn,
        getCreatedOn: () => createdOn,
        getHashedPassword: async () => await hashPassword({ password }),
      });

      function isValidEmail(email) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/;
        try {
          return emailRegex.test(email.toLowerCase());
        } catch (error) {
          throw new Error(`${email} is not a valid email`);
        }
      }

      function isValidPassword(password) {
        const passwordRegex =
          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        try {
          return passwordRegex.test(password);
        } catch (error) {
          throw new Error("Not a valid password");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      logger.error(
        `The makeUser function failed due to an error.\n\t\t${error.stack}`
      );
      throw new Error(
        "An error occurred while processing your request. Please try again later."
      );
    }
  };
}
