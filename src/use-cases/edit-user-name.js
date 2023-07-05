

export default function makeEditUserName({
  makeUser,
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
