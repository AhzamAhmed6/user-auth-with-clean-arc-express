import logger from "../logger/index.js";
export default function makeVerifyUser({ findUser }) {
  return async function verifyUser(httpRequest) {
    const headers = {
      "Content-Type": "application/json",
    };
    const { valid } = httpRequest;

    try {
      if (valid === false) {
        return {
          headers,
          statusCode: 200,
          body: { valid },
        };
      }
      const { userId } = httpRequest.user;

      const user = findUser({ id: userId });
      if (user === undefined) {
        return {
          headers,
          statusCode: 200,
          body: { valid: false },
        };
      }
      return {
        headers,
        statusCode: 200,
        body: { valid: true },
      };
    } catch (error) {
      logger.error(
        `The verifyUser function failed due to an error.\n\t\t${error.stack}`
      );

      const responseBody = {
        success: false,
        error:
          "An error occurred while processing your request. Please try again later.",
      };

      let statusCode = 500;
      if (error instanceof Error) {
        statusCode = 400;
        responseBody.valid = false;
      }

      return {
        headers,
        statusCode,
        body: responseBody,
      };
    }
  };
}
