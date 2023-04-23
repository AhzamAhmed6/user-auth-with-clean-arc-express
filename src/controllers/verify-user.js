import logger from "../logger/index.js";

export default function makeVerifyUser({ verifyToken }) {
  return async function verifyUser(httpRequest) {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const token = httpRequest.headers.Authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Authorization header is missing or invalid.");
      }

      const isValidToken = await verifyToken({
        token,
        tokenKey: process.env.ACCESS_KEY,
      });

      const responseBody = {
        valid: isValidToken !== false,
      };

      return {
        headers,
        statusCode: 200,
        body: responseBody,
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
