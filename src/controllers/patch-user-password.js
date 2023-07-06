export default function makePatchUserPassword({
  editUserPassword,
  authorizeUser,
  validateInputs,
  generateTokens,
  prepareResponseBody,
  handleError,
}) {
  return async function patchUserPassword(httpRequest) {
    try {
      const user = authorizeUser(httpRequest);
      const { oldPassword, newPassword } = httpRequest.body;

      validateInputs({ id, oldPassword, newPassword });

      await editUserPassword({ id: user.id, oldPassword, newPassword });

      // In this section, we generate new tokens when the password is changed,
      // as part of our strategy to invalidate all previously issued access
      // and refresh tokens for the user.
      const tokens = await generateTokens(user);

      const { hashedPassword, ...userWithoutSensitiveData } = user;
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
