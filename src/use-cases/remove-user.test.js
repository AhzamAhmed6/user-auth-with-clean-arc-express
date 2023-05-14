import removeUserDependencies from "../helper/remove-user.helper";
import makeRemoveUser from "./remove-user";

const { validateId } = removeUserDependencies;

describe("remove User", () => {
  it("remove an inserted user from Db", async () => {
    const findUserById = jest.fn(() => null);
    const deleteUser = jest.fn(() => 1);
    const removeUser = makeRemoveUser({ validateId, findUserById, deleteUser });
    const deleteCount = await removeUser({ id: "1234" });
    expect(deleteCount).toBe(1);
  });

  it("remove a user that is not present in DB", async () => {
    const findUserById = jest.fn(() => {
      throw new Error("User not found.");
    });
    const deleteUser = jest.fn(() => 1);
    const removeUser = makeRemoveUser({ validateId, findUserById, deleteUser });
    await expect(removeUser({ id: "1234" })).rejects.toThrow("User not found.");
  });

  it("id not provided", async () => {
    const findUserById = jest.fn(() => null);
    const deleteUser = jest.fn(() => 0);
    const removeUser = makeRemoveUser({ validateId, findUserById, deleteUser });
    await expect(removeUser({})).rejects.toThrow("Plz provide Id");
  });
});
