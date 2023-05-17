import logger from "../logger/index.js";
import userService from "../use-cases/index.js";

const { findUser } = userService;

function makeValidateUser({ findUser }) {
  return async function validateUser(httpRequest) {
    const { user } = httpRequest;
    if (!user) {
      return false;
    }
    const { userId } = httpRequest.user;
    await findUser({ id: userId });
    return true;
  };
}

function makeHandleError({ handleClientError, handleServerError }) {
  return function handleError(error) {
    if (error instanceof Error) {
      return handleClientError();
    }
    return handleServerError(error);
  };
}

function handleClientError() {
  return {
    headers: { "Content-Type": "application/json" },
    statusCode: 400,
    body: { valid: false },
  };
}

function makeHandleServerError({ logger }) {
  return function handleServerError(error) {
    logger.error(
      `The verifyUser function failed due to an error.\n\t\t${error.stack}`
    );
    const headers = { "Content-Type": "application/json" };
    const statusCode = 500;
    const responseBody = {
      success: false,
      error:
        "An error occurred while processing your request. Please try again later.",
    };

    return { headers, statusCode, responseBody };
  };
}

const validateUser = makeValidateUser({ findUser });
const handleServerError = makeHandleServerError({ logger });
const handleError = makeHandleError({ handleClientError, handleServerError });

const verifyUserDependencies = { validateUser, handleError };

export default verifyUserDependencies;
