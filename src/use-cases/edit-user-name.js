import makeUser from "../user/index.js";

export default function makeEditUserName({ validateInputs,findExistingUser,getPassword,updateUserName }) {
  return async function editUserName({
    id,
    firstName,
    lastName,
    ...rest
  } = {}) {
    validateInputs(id, firstName, lastName);

    const existing = await findExistingUser(usersDb, id);

    const user = makeUser({ firstName, lastName, password: getPassword(rest), ...rest });

    const updated = await updateUserName(usersDb, existing, user);

    return { ...updated };
  };
}

