import makeUser from "../user/index.js";

export default function makeAddUser({ usersDb }) {
  return async function addUser(userInfo) {
    const user = makeUser(userInfo);

    const existingUserById = await usersDb.findById({ id: user.getId() });
    const existingUserByEmail = await usersDb.findByEmail({
      email: user.getEmail(),
    });

    if (existingUserById || existingUserByEmail) {
      throw new Error("User already registered");
    }

    const newUser = {
      id: user.getId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: user.getEmail(),
      hashedPassword: await user.getHashedPassword(),
    };

    return usersDb.insert(newUser);
  };
}
