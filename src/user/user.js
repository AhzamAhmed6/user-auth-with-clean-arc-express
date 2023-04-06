export default function buildMakeUser({ Id, hashPassword }) {
  return function makeUser({
    id = Id.makeId(),
    firstName,
    lastName,
    email,
    password,
  }) {
    if (!Id.isValidId(id)) {
      throw new Error("User must have a valid id.");
    }
    if (![firstName, lastName, email, password].every(Boolean)) {
      throw new Error("Please provide complete information");
    }
    if (!isValidEmail(email)) {
      throw new Error(`${email} is not a valid email`);
    }
    if (!isValidPassword(password)) {
      throw new Error(
        "Password must contains min 8 letter password, with at least a symbol, upper and lower case letters and a number"
      );
    }

    return Object.freeze({
      getId: () => id,
      getFirstName: () => firstName,
      getLastName: () => lastName,
      getEmail: () => email,
      getHashedPassword: async () => await hashPassword({ password }),
    });

    function isValidEmail(email) {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/;
      return emailRegex.test(email.toLowerCase());
    }

    function isValidPassword(password) {
      var passwordRegex =
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return passwordRegex.test(password);
    }
  };
}
