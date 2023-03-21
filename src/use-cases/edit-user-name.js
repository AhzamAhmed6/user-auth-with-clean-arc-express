import makeUser from "../user/index.js";
export default function makeEditUserName({ usersDb }) {
  return async function editUserName({
    id,
    firstName,
    lastName,
    ...rest
  } = {}) {
    var password;
    if (rest.hashedPassword) {
      password = rest.hashedPassword;
      delete rest.hashedPassword;
    }
    if (!id) {
      throw new Error("You must supply an id.");
    }
    if (!firstName || !lastName) {
      throw new Error("You must supply first name and last name.");
    }
    const existing = await usersDb.findById({ id });

    if (!existing) {
      throw new RangeError("User not found.");
    }
    const user = makeUser({ firstName, lastName, password, ...rest });

    const updated = await usersDb.updateName({
      id: id,
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: existing.email,
      hashedPassword: existing.hashedPassword,
    });

    return { ...updated };
  };
}
