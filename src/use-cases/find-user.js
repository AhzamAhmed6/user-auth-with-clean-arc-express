export default function makeFindUser({ usersDb }) {
  return async function findUser({ id, email, ...rest }) {
    if (!id && !email) {
      throw new Error("Provide id or email");
    }
    if (id) {
      const exists = await usersDb.findById({ id: id });
      if (!exists) {
        throw new Error("User not found.");
      }
      return exists;
    }
    if (email) {
      const exists = await usersDb.findByEmail({ email: email });
      if (!exists) {
        throw new Error("User not found.");
      }
      return exists;
    }
  };
}
