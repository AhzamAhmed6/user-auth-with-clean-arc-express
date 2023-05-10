import logger from "../logger/index.js";

export default function makeDeleteUser({ removeUser }) {
  return async function deleteUser(httpRequest) {
    const requestId = httpRequest.query.id;

    try {
      const isAuthorized = authorizeUser(httpRequest);
      if (!isAuthorized) {
        throw new Error("You do not have permission to perform this action");
      }

      const deletedCount = await removeUser({ id: requestId });
      if (deletedCount == 0) {
        return createNotFoundResponse();
      }
      return createSuccessResponse();
    } catch (error) {
      if (error instanceof Error) {
        return handleError(error, handleClientError);
      }
      return handleError(error, handleServerError);
    }
  };
}

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

function createSuccessResponse() {
  const response = {
    success: true,
    message: "User deleted successfully",
  };
  return createHttpResponse(200, response);
}

function createNotFoundResponse() {
  const response = {
    success: false,
    message: "User not found",
  };
  return createHttpResponse(404, response);
}

function createHttpResponse(statusCode, message) {
  const headers = { "Content-Type": "application/json" };
  const body = message;
  return { headers, statusCode, body };
}

function handleError(error, errorHandler) {
  return errorHandler(error);
}

function handleClientError(error) {
  const statusCode = 400;
  const { message } = error;
  const body = { success: false, error: message };
  const headers = { "Content-Type": "application/json" };
  return { headers, statusCode, body };
}

function handleServerError(error) {
  const statusCode = 500;
  const message =
    "An error occurred while processing your request. Please try again later.";
  const body = { success: false, error: message };
  const headers = { "Content-Type": "application/json" };
  logger.error(
    `The deleteUser function failed due to an error.\n\t\t${error.stack}`
  );
  return { headers, statusCode, body };
}
