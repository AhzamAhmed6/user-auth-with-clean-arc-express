import logger from "../logger/index.js";

export default function makeDeleteUser({ removeUser }) {
  return async function deleteUser(httpRequest) {
    try {
      const { deletedCount } = await removeUser({ id: httpRequest.query.id });
      const statusCode = deletedCount === 0 ? 404 : 200;
      const message =
        deletedCount === 0 ? "User not found" : "User deleted successfully";

      const headers = { "Content-Type": "application/json" };
      const body = { success: true, message };
      return { headers, statusCode, body };
    } catch (error) {
      if (error instanceof Error) {
        // Return error response
        const errorHeaders = { "Content-Type": "application/json" };
        const errorStatusCode = 400;
        const errorBody = {
          success: false,
          error: error.message,
        };
        return {
          headers: errorHeaders,
          statusCode: errorStatusCode,
          body: errorBody,
        };
      }
      logger.error(
        `The deleteUser function failed due to an error.\n\t\t${error.stack}`
      );

      const headers = { "Content-Type": "application/json" };
      const statusCode = 400;
      const body = {
        success: false,
        error:
          "An error occurred while processing your request. Please try again later.",
      };
      return { headers, statusCode, body };
    }
  };
}
