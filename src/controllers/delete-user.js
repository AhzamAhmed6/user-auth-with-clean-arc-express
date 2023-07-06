export default function makeDeleteUser({
  authorizeUser,
  removeUser,
  createResponse,
  handleError,
}) {
  return async function deleteUser(httpRequest) {
    try {
      const user = authorizeUser(httpRequest);
      await removeUser({ id: user.id });
      return createResponse();
    } catch (error) {
      return handleError(error);
    }
  };
}
