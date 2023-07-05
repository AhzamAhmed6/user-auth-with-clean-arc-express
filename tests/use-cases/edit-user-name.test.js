import editUserNameDependencies from "../../src/use-case-helper/edit-user-name.helper";
import makeEditUserName from "../../src/use-cases/edit-user-name";

const makeUser = jest.fn(()=>{null})
describe("edit user name", () => {
  it("requires id, firstName and lastName", async () => {
    const dependenciesCopy = { makeUser, ...editUserNameDependencies };
    const validateInputs = jest.fn(() => {
      throw Error("You must supply first name and last name.");
    });
    dependenciesCopy.validateInputs = validateInputs;
    const editUserName = makeEditUserName(dependenciesCopy);
    await expect(editUserName({ id: "123" })).rejects.toThrow(
      "You must supply first name and last name."
    );
  });
  it("user doesnot exists", async () => {
    const dependenciesCopy = { makeUser, ...editUserNameDependencies };
    const findExistingUser = jest.fn(() => {
      throw Error("User not found.");
    });
    dependenciesCopy.findExistingUser = findExistingUser;
    const editUserName = makeEditUserName(dependenciesCopy);
    await expect(
      editUserName({
        id: "123",
        firstName: "John",
        lastName: "Doe"
      })
    ).rejects.toThrow("User not found.");
  });
  it("successfully update user name", async () => {
    const makeUser = jest.fn(() => {
      return Object.freeze({
      getId: () => "123",
      getFirstName: () => "John2",
      getLastName: () => "Doe2",
      getEmail: () => null,
      getModifiedOn: () => null,
      getCreatedOn: () => null,
      getHashedPassword: async () => null,
    })})
    const dependenciesCopy = { makeUser, ...editUserNameDependencies };
    const findExistingUser = jest.fn(() => ({
      id: "123",
      firstName: "John",
      lastName: "Doe",
    }));
    dependenciesCopy.findExistingUser = findExistingUser;
    const updateUserName = jest.fn(() => ({
      id: "123",
      firstName: "Jane2",
      lastName: "Doe2",
    }));
    dependenciesCopy.updateUserName = updateUserName;
    const editUserName = makeEditUserName(dependenciesCopy);
    const result = await editUserName({
      id: "123",
      firstName: "Jane2",
      lastName: "Doe2"
    });
    expect(result).toEqual({ id: '123', firstName: 'Jane2', lastName: 'Doe2' })
  
  })
})
