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
        throw new Error("User must have a valid id.");
      }
      if (![firstName, lastName, email, password].every(Boolean)) {
        throw new Error("Please provide complete information");
      }
      if (!isValidEmail(email)) {
        throw new Error(`${email} is not a valid email`);
      }

      if (!isValidPassword(password)) {
        const errorMessage =
          "Password must contains min 8 letter password, with at least a symbol, upper and lower case letters and a number";
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
      throw new Error("Something went wrong");
    }
  };
}
