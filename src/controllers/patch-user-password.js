export default function makePatchUserPassword({
  editUserPassword,
  authorizeUser,
  generateTokens,
  prepareResponseBody,
  handleError,
}) {
  return async function patchUserPassword(httpRequest) {
    try {
      const { oldPassword, newPassword } = httpRequest.body;
      const user = authorizeUser(httpRequest);

      const userInfo = await editUserPassword({
        id: user.id,
        oldPassword,
        newPassword,
      });
      
      // In this section, we generate new tokens when the password is changed,
      // as part of our strategy to invalidate all previously issued access 
      // and refresh tokens for the user.
      const tokens = await generateTokens(userInfo);

      const { hashedPassword, ...userWithoutSensitiveData } = userInfo;
      const responseBody = prepareResponseBody(
        userWithoutSensitiveData,
        tokens
      );

     const headers = { "Content-Type": "application/json" };
      const statusCode = 200;
      const body = responseBody;
      return { headers, statusCode, body };
    } catch (error) {
      return handleError(error);
    }
  };
}
