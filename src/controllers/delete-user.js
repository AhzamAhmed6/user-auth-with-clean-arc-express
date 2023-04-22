import logger from "../logger/index.js";
export default function makeDeleteUser({ removeUser }) {
  return async function deleteUser(httpRequest) {
    try {
      const deleted = await removeUser({ id: httpRequest.query.id });
      const message =
        deleted.deletedCount === 0
          ? "User not found"
          : "User deleted successfully";
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: deleted.deletedCount === 0 ? 404 : 200,
        body: { success: true, message },
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 400,
          body: {
            success: false,
            error: error.message,
          },
        };
      }
    }
    logger.error(
      `The deleteUser function failed due to an error.\n\t\t${error.stack}`
    );
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: {
        success: false,
        error:
          "An error occurred while processing your request. Please try again later.",
      },
    };
  };
}
