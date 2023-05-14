import logger from "../logger/index.js";
import usersDb from "../data-access/index.js";
import handlePassword from "../password/index.js";

function makeCheckUserExists({ usersDb }) {
  return async function checkUserExists({ email }) {
    const existingUserByEmail = await usersDb.findByEmail({ email });
    if (!existingUserByEmail) {
      throw new Error(
        "User not found. Please check the provided details and try again."
      );
    }
    return existingUserByEmail;
  };
}

function makeMatchPassword({ verifyPassword }) {
  return async function matchPassword({ password, hashedPassword }) {
    const isPasswordMatch = await verifyPassword({
      password,
      hashedPassword,
    });
    if (!isPasswordMatch) {
      throw new Error("Incorrect password. Please try again.");
    }
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
const { verifyPassword } = handlePassword;
const matchPassword = makeMatchPassword({ verifyPassword });
const handleServerError = makeHandleServerError({ logger });
const handleError = makeHandleError({ handleClientError, handleServerError });

const authenticateUserDependencies = {
  checkUserExists,
  matchPassword,
  handleError,
};
export default authenticateUserDependencies;
