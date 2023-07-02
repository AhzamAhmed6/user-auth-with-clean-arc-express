import makeUser from "../user/index.js";

export default function makeEditUserName({
  validateInputs,
  findExistingUser,
  getPassword,
  updateUserName,
}) {
  return async function editUserName({
    id,
    firstName,
    lastName,
    ...rest
  } = {}) {
    validateInputs(id, firstName, lastName);

    const existing = await findExistingUser({ id });

    const user = makeUser({
      firstName,
      lastName,
      password: getPassword(rest),
      ...rest,
    });

    const updated = await updateUserName(existing, user);

    return { ...updated };
  };
}
