import logger from "../logger/index.js";

export default function makeDeleteUser({ removeUser }) {
  return async function deleteUser(httpRequest) {
    const headers = { "Content-Type": "application/json" };
    const requestId = httpRequest.query.id;
    const { userId } = httpRequest.user;

    try {
      if (requestId != userId) {
        throw new Error("You do not have permission to perform this action");
      }

      const deletedCount = await removeUser({ id: requestId });

      const statusCode = deletedCount ? 200 : 404;
      const message = deletedCount
        ? "User deleted successfully"
        : "User not found";
      const body = { success: true, message };

      return { headers, statusCode, body };
    } catch (error) {
      const statusCode = error instanceof Error ? 400 : 500;
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred while processing your request. Please try again later.";
      const body = { success: false, error: message };

      if (!(error instanceof Error)) {
        logger.error(
          `The deleteUser function failed due to an error.\n\t\t${error.stack}`
        );
      }

      return { headers, statusCode, body };
    }
  };
}
