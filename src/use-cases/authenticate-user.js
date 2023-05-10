import logger from "../logger/index.js";

export default function makeAuthenticateUser({ usersDb, verifyPassword }) {
  return async function authenticateUser({ email, password }) {
    try {
      const existingUserByEmail = await checkUserExists({ email, usersDb });

      await matchPassword({
        password,
        hashedPassword: existingUserByEmail.hashedPassword,
        verifyPassword,
      });
      return existingUserByEmail;
    } catch (error) {
      handleError(error);
    }
  };
}

async function checkUserExists({ email, usersDb }) {
  const existingUserByEmail = await usersDb.findByEmail({ email });
  if (!existingUserByEmail) {
    throw new Error(
      "User not found. Please check the provided details and try again."
    );
  }
  return existingUserByEmail;
}

async function matchPassword({ password, hashedPassword, verifyPassword }) {
  const isPasswordMatch = await verifyPassword({
    password,
    hashedPassword,
  });
  if (!isPasswordMatch) {
    throw new Error("Incorrect password. Please try again.");
  }
}

function makeHandleError({ logger }) {
  return function handleError(error) {
    if (error instanceof Error) {
      return handleClientError(error);
    }
    return handleServerError(error, logger);
  };
}

const handleError = makeHandleError({ logger });

function handleClientError(error) {
  throw error;
}

function handleServerError(error) {
  logger.error(
    `The authenticateUser function failed due to an error.\n\t\t${error.stack}`
  );
  throw new Error(
    "An error occurred while processing your request. Please try again later."
  );
}
