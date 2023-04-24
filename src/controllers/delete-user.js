import logger from "../logger/index.js";

export default function makeDeleteUser({ verifyToken, removeUser }) {
  return async function deleteUser(httpRequest) {
    const headers = { "Content-Type": "application/json" };
    const token = httpRequest.headers.authorization?.split(" ")[1];

    try {
      if (!token) {
        throw new Error("Authorization header is missing or invalid.");
      }

      const isValidToken = await verifyToken({
        token,
        tokenKey: process.env.ACCESS_KEY,
      });

      if (!isValidToken) {
        throw new Error("You do not have permission to perform this action");
      }

      const { deletedCount } = await removeUser({ id: httpRequest.query.id });

      const statusCode = deletedCount ? 200 : 404;
      const message = deletedCount
        ? "User deleted successfully"
        : "User not found";
      const body = { success: true, message };

      return { headers, statusCode, body };
    } catch (error) {
      const errorHeaders = { "Content-Type": "application/json" };
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

      return { headers: errorHeaders, statusCode, body };
    }
  };
}
