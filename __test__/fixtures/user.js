import cuid from "cuid";
import faker from "faker";

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

export default function makeFakeUser(overrides) {
  const user = {
    id: Id.makeId(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    modifiedOn: new Date(Date.now()).toUTCString(),
    createdOn: new Date(Date.now()).toUTCString(),
    password: faker.internet.password() + "+-$1@#" + faker.internet.password(),
  };

  return {
    ...user,
    ...overrides,
  };
}
