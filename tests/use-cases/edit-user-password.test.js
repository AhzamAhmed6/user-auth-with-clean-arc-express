import editUserPasswordDependencies from "../../src/use-case-helper/edit-user-password.helper.js";
import makeEditUserPassword from "../../src/use-cases/edit-user-password.js";

describe("edit user password", () => {
  it("User not found", async () => {
    const dependenciesCopy = { ...editUserPasswordDependencies }; // Create a copy of the dependencies object
    const findUserById = jest.fn(() => {
      throw Error("User not found.");
    });
    dependenciesCopy.findUserById = findUserById;
    const editUserPassword = makeEditUserPassword(dependenciesCopy);
    await expect(
      editUserPassword({
        id: "123",
        oldPassword: "oldPass",
        newPassword: "newPass",
      })
    ).rejects.toThrow("User not found.");
  });

  it("Wrong old password", async () => {
    const dependenciesCopy = { ...editUserPasswordDependencies }; // Create a copy of the dependencies object
    const findUserById = jest.fn(() => {
      return { hashedPassword: "1234" };
    });
    const validateOldPassword = jest.fn(() => {
      throw Error("Wrong Old Password.");
    });
    dependenciesCopy.findUserById = findUserById;
    dependenciesCopy.validateOldPassword = validateOldPassword;
    const editUserPassword = makeEditUserPassword(dependenciesCopy);
    await expect(
      editUserPassword({
        id: "123",
        oldPassword: "oldPass",
        newPassword: "newPass",
      })
    ).rejects.toThrow("Wrong Old Password.");
  });

  it("Should update password successfully", async () => {
    const dependenciesCopy = { ...editUserPasswordDependencies }; // Create a copy of the dependencies object
    const findUserById = jest.fn(() => {
      return { hashedPassword: "1234" };
    });
    const validateOldPassword = jest.fn(() => {});
    const updateUserPassword = jest.fn(() => {
      return {
        id: "123",
        firstName: "Ahzam",
        lastName: "Ahmed",
        email: "test@test.com",
      };
    });
    dependenciesCopy.findUserById = findUserById;
    dependenciesCopy.validateOldPassword = validateOldPassword;
    dependenciesCopy.updateUserPassword = updateUserPassword;
    const editUserPassword = makeEditUserPassword(dependenciesCopy);
    await expect(
      await editUserPassword({
        id: "123",
        oldPassword: "oldPass",
        newPassword: "newPass",
      })
    ).toMatchObject({
      id: "123",
      firstName: "Ahzam",
      lastName: "Ahmed",
      email: "test@test.com",
    });
  });
});
