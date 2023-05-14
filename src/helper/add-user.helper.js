import logger from "../logger/index.js";
import usersDb from "../data-access/index.js";

function makeCheckUserExists({ usersDb }) {
  return async function checkUserExists({ user }) {
    const existingUserById = await usersDb.findById({ id: user.getId() });
    const existingUserByEmail = await usersDb.findByEmail({
      email: user.getEmail(),
    });

    if (existingUserById || existingUserByEmail) {
      throw new Error(
        "Unable to register user. The provided email address is already associated with an existing account."
      );
    }
  };
}

function makeInsertUser({ usersDb }) {
  return async function insertUser(user) {
    return usersDb.insert(user);
  };
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

function makeHandleError({ handleClientError, handleServerError }) {
  return function handleError(error) {
    if (error instanceof Error) {
      return handleClientError(error);
    }
    return handleServerError(error);
  };
}

function handleClientError(error) {
  throw error;
}

function makeHandleServerError({ logger }) {
  return function handleServerError(error) {
    logger.error(
      `The authenticateUser function failed due to an error.\n\t\t${error.stack}`
    );
    throw new Error(
      "An error occurred while processing your request. Please try again later."
    );
  };
}

const checkUserExists = makeCheckUserExists({ usersDb });
const insertUser = makeInsertUser({ usersDb });
const handleServerError = makeHandleServerError({ logger });
const handleError = makeHandleError({ handleClientError, handleServerError });

const addUserDependencies = {
  checkUserExists,
  formatUser,
  insertUser,
  handleError,
};
export default addUserDependencies;
