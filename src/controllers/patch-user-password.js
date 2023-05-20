export default function makePatchUserPassword({
  editUserPassword,
  authorizeUser,
  handleError,
}) {
  return async function patchUserPassword(httpRequest) {
    try {
      const { oldPassword, newPassword } = httpRequest.body;
      const user = authorizeUser(httpRequest);

      const patched = await editUserPassword({
        id: user.id,
        oldPassword,
        newPassword,
      });
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 200,
        body: { patched },
      };
    } catch (error) {
      return handleError(error);
    }
  };
}
