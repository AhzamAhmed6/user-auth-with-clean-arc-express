import logger from "../logger/index.js";

function authorizeUser(httpRequest) {
  const requestId = httpRequest.query.id;
  const { user } = httpRequest;
  if (user === false) {
    return false;
  }
  if (requestId != user.userId) {
    return false;
  }
  return true;
}

function createHttpResponse({ statusCode, message }) {
  const headers = { "Content-Type": "application/json" };
  const body = message;
  return { headers, statusCode, body };
}

function makeCreateSuccessResponse({ createHttpResponse }) {
  return function createSuccessResponse() {
    const response = {
      success: true,
      message: "User deleted successfully",
    };
    return createHttpResponse({ statusCode: 200, message: response });
  };
}

function makeCreateNotFoundResponse({ createHttpResponse }) {
  return function createNotFoundResponse() {
    const response = {
      success: false,
      message: "User not found",
    };
    return createHttpResponse({ statusCode: 404, message: response });
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

const createSuccessResponse = makeCreateSuccessResponse({ createHttpResponse });
const createNotFoundResponse = makeCreateNotFoundResponse({
  createHttpResponse,
});
const handleServerError = makeHandleServerError({ logger });
const handleError = makeHandleError({ handleClientError, handleServerError });

const deleteUserDependencies = {
  authorizeUser,
  createNotFoundResponse,
  createSuccessResponse,
  handleError,
};

export default deleteUserDependencies;
