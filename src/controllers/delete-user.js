export default function makeDeleteUser({
  authorizeUser,
  removeUser,
  createNotFoundResponse,
  createSuccessResponse,
  handleError,
}) {
  return async function deleteUser(httpRequest) {
    const requestId = httpRequest.query.id;

    try {
      const isAuthorized = authorizeUser(httpRequest);
      if (!isAuthorized) {
        throw new Error("You do not have permission to perform this action");
      }

      const deletedCount = await removeUser({ id: requestId });
      if (deletedCount == 0) {
        return createNotFoundResponse();
      }
      return createSuccessResponse();
    } catch (error) {
      return handleError(error);
    }
  };
}
