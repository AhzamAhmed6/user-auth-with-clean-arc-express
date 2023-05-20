import logger from "../logger/index.js";

function authorizeUser(httpRequest) {
  const { user } = httpRequest;
  if (user === false) {
    throw Error("Unauthorize");
  }
  return user;
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
  const headers = { "Content-Type": "application/json" };
  const statusCode = 400;
  const { message } = error;
  const body = { success: false, error: message };
  return { headers, statusCode, body };
}

function makeHandleServerError({ logger }) {
  return function handleServerError(error) {
    const headers = { "Content-Type": "application/json" };
    const statusCode = 500;
    const message =
      "An error occurred while processing your request. Please try again later.";
    const body = { success: false, error: message };
    logger.error(
      `An unknown error occurred while processing a request.\n\t\t${error.stack}`
    );
    return { headers, statusCode, body };
  };
}

const handleServerError = makeHandleServerError({ logger });
const handleError = makeHandleError({ handleClientError, handleServerError });

const patchUserPasswordDependencies = { authorizeUser, handleError };
export default patchUserPasswordDependencies;
