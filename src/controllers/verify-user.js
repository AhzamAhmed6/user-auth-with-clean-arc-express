export default function makeVerifyUser({ validateUser, handleError }) {
  return async function verifyUser(httpRequest) {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const valid = await validateUser(httpRequest);
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
