export default function makeEditUserName({
  makeUser,
  validateInputs,
  findExistingUser,
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

    rest.modifiedOn = new Date(Date.now()).toUTCString();

    const user = makeUser({
      id,
      firstName,
      lastName,
      password: rest.hashedPassword,
      ...rest,
    });

    const updated = await updateUserName(existing, user);

    return { ...updated };
  };
}
