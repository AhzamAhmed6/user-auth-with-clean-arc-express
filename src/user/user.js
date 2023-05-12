export default function buildMakeUser({ Id, hashPassword, validateInputs }) {
  return function makeUser({
    id = Id.makeId(),
    firstName,
    lastName,
    email,
    password,
    modifiedOn = new Date(Date.now()).toUTCString(),
    createdOn = new Date(Date.now()).toUTCString(),
  }) {
    validateInputs({ Id, id, firstName, lastName, email, password });

    return Object.freeze({
      getId: () => id,
      getFirstName: () => firstName,
      getLastName: () => lastName,
      getEmail: () => email,
      getModifiedOn: () => modifiedOn,
      getCreatedOn: () => createdOn,
      getHashedPassword: async () => await hashPassword({ password }),
    });
  };
}
