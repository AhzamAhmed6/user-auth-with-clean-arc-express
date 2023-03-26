import makeUser from "../user/index.js";

export default function makeAddUser({ usersDb }) {
  return async function addUser(userInfo) {
    const user = makeUser(userInfo);
    if (
      (await usersDb.findById({ id: user.getId() })) ||
      (await usersDb.findByEmail({ email: user.getEmail() }))
    ) {
      throw new Error("User already registered");
    }
    return usersDb.insert({
      id: user.getId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: user.getEmail(),
      hashedPassword: user.getHashedPassword(),
    });
  };
}
