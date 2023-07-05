export default function makeEditUserPassword({
  validateInputs,
  findUserById,
  validateOldPassword,
  updateUserPassword,
  handleError,
}) {
  return async function editUserPassword({ id, oldPassword, newPassword }) {
    try {
      validateInputs({ id, oldPassword, newPassword });

      const existing = await findUserById({ id });

      existing.modifiedOn = new Date(Date.now()).toUTCString();

      const { hashedPassword } = existing;
      await validateOldPassword({ oldPassword, hashedPassword });

      const updated = await updateUserPassword(existing, newPassword);

      return updated;
    } catch (error) {
      return handleError(error);
    }
  };
}
