import logger from "../logger/index.js";

function validateUserExists(user) {
  if (user === false) {
    throw new Error("User Not Found");
  }
}

function createSuccessResponse(patched) {
  const headers = { "Content-Type": "application/json" };
  const statusCode = 200;
  const body = patched;
  return { headers, statusCode, body };
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

const patchUserNameDependencies = {
  validateUserExists,
  createSuccessResponse,
  handleError,
};

export default patchUserNameDependencies;
