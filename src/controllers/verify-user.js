import logger from "../logger/index.js";

export default function makeVerifyUser({ findUser }) {
  return async function verifyUser(httpRequest) {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const valid = await validateUser(httpRequest, findUser);
      return {
        headers,
        statusCode: 200,
        body: { valid },
      };
    } catch (error) {
      return handleError(error, headers);
    }
  };
}

async function validateUser(httpRequest, findUser) {
  const { user } = httpRequest;
  if (!user) {
    return false;
  }
  const { userId } = httpRequest.user;
  await findUser({ id: userId });
  return true;
}

function handleError(error, headers) {
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
