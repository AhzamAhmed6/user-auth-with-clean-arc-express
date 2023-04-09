import logger from "../logger.js";
export default function makeGetUsers({ findUser }) {
  return async function getUser(httpRequest) {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const users = await findUser({
        userId: httpRequest.query.userId,
      });
      return {
        headers,
        statusCode: 200,
        body: users,
      };
    } catch (e) {
      // TODO: Error logging
      logger.error(e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
}
