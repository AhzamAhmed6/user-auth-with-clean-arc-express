export default function makeLoginUser({
  authenticateUser,
  generateTokens,
  prepareResponseBody,
  handleError,
}) {
  return async function loginUser(httpRequest) {
    try {
      const credentials = httpRequest.body;
      const userInfo = await authenticateUser(credentials);
      const tokens = await generateTokens(userInfo);

      const { hashedPassword, ...userWithoutSensitiveData } = userInfo;
      const responseBody = prepareResponseBody(
        userWithoutSensitiveData,
        tokens
      );

      const headers = { "Content-Type": "application/json" };
      const statusCode = 201;
      const body = responseBody;
      return { headers, statusCode, body };
    } catch (error) {
      return handleError(error);
    }
  };
}
