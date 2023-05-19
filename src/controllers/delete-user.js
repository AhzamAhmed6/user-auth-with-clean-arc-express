export default function makeDeleteUser({
  authorizeUser,
  removeUser,
  createResponse,
  handleError,
}) {
  return async function deleteUser(httpRequest) {
    const requestId = httpRequest.query.id;
    try {
      const isAuthorized = authorizeUser(httpRequest);
      if (!isAuthorized) {
        throw new Error("User not found");
      }
      await removeUser({ id: requestId });
      return createResponse();
    } catch (error) {
      return handleError(error);
    }
  };
}
