export default function makePatchUserName({
  editUserName,
  authorizeUser,
  createSuccessResponse,
  handleError,
}) {
  return async function patchUserName(httpRequest) {
    try {
      const user = authorizeUser(httpRequest);
      const { firstName, lastName } = httpRequest.body;

      const patched = await editUserName({ ...user, firstName, lastName });
      const response = createSuccessResponse(patched);
      return response;
    } catch (e) {
      return handleError;
    }
  };
}
