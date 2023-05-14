export default function makePostUser({
  generateTokens,
  addUserToDatabase,
  prepareResponseBody,
  handleError,
}) {
  return async function postUser(httpRequest) {
    try {
      const userInfo = httpRequest.body;
      const tokens = await generateTokens(userInfo);
      const userWithoutSensitiveData = await addUserToDatabase(userInfo);

      const responseBody = prepareResponseBody({
        userWithoutSensitiveData,
        tokens,
      });

      const headers = { "Content-Type": "application/json" };
      const statusCode = 201;
      const body = responseBody;
      return { headers, statusCode, body };
    } catch (error) {
      return handleError(error);
    }
  };
}
