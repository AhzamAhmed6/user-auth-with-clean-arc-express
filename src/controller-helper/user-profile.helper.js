import logger from "../logger/index.js";

function authorizeUser(httpRequest) {
  const { user } = httpRequest;
  if (user) {
    return user;
  }
  throw new Error("User not found");
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
  const statusCode = 400;
  const { message } = error;
  const body = { success: false, message };
  const headers = { "Content-Type": "application/json" };
  return { headers, statusCode, body };
}

function makeHandleServerError({ logger }) {
  return function handleServerError(error) {
    const statusCode = 500;
    const message =
      "An error occurred while processing your request. Please try again later.";
    const body = { success: false, error: message };
    const headers = { "Content-Type": "application/json" };
    logger.error(
      `The deleteUser function failed due to an error.\n\t\t${error.stack}`
    );
    return { headers, statusCode, body };
  };
}

const handleServerError = makeHandleServerError({ logger });
const handleError = makeHandleError({ handleClientError, handleServerError });

const userProfileDependencies = {
  authorizeUser,
  handleError,
};

export default userProfileDependencies;
