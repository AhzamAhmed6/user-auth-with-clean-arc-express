export default function makePatchUserName({
  editUserName,
  validateUserExists,
  createSuccessResponse,
  handleError,
}) {
  return async function patchUserName(httpRequest) {
    try {
      const { user } = httpRequest;

      validateUserExists(user);

      const { firstName, lastName } = httpRequest.body;

      const patched = await editUserName({ ...user, firstName, lastName });
      const response = createSuccessResponse(patched);
      return response;
    } catch (e) {
      return handleError;
    }
  };
}
