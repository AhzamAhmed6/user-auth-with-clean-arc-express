import logger from "../logger/index.js";

function authorizeUser(httpRequest) {
  const { user } = httpRequest;
  const requestId = httpRequest.query.id;
  return user && requestId === user.id;
}

function createResponse() {
  const headers = { "Content-Type": "application/json" };
  const statusCode = 200;
  const body = {
    success: true,
    message: "User deleted successfully",
  };
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

const deleteUserDependencies = {
  authorizeUser,
  createResponse,
  handleError,
};

export default deleteUserDependencies;
