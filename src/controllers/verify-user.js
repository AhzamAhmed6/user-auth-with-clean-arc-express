import logger from "../logger/index.js";

export default function makeVerifyUser({ findUser }) {
  return async function verifyUser(httpRequest) {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      let { user } = httpRequest;

      if (user === false) {
        return {
          headers,
          statusCode: 400,
          body: { valid },
        };
      }
      const { userId } = httpRequest.user;

      user = await findUser({ id: userId });
      if (user === undefined) {
        return {
          headers,
          statusCode: 400,
          body: { valid: false },
        };
      }
      return {
        headers,
        statusCode: 200,
        body: { valid: true },
      };
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = 400;

        return {
          headers,
          statusCode,
          body: { valid: false },
        };
      }
      logger.error(
        `The verifyUser function failed due to an error.\n\t\t${error.stack}`
      );

      const responseBody = {
        success: false,
        error:
          "An error occurred while processing your request. Please try again later.",
      };
      const statusCode = 500;
      return { headers, statusCode, responseBody };
    }
  };
}
