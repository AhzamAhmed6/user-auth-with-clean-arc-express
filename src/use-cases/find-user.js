export default function makeFindUser({
  validateInput,
  findUserById,
  findUserByEmail,
}) {
  return async function findUser({ id, email }) {
    validateInput({ id, email });

    if (id) {
      return findUserById({ id });
    }
    if (email) {
      return findUserByEmail({ email });
    }
  };
}
