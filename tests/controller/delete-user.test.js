import deleteUserDependencies from "../../src/controller-helper/delete-user.helper.js";
import makeDeleteUser from "../../src/controllers/delete-user.js";

const { createResponse, handleError } = deleteUserDependencies;

describe("deleteUser", () => {
  it("successfully deleted message", async () => {
    const authorizeUser = jest.fn(() => true);
    const removeUser = jest.fn(() => 1);
    const httpRequest = { query: { id: "1234" } };
    const deleteUser = makeDeleteUser({
      authorizeUser,
      removeUser,
      createResponse,
      handleError,
    });
    const actualResponse = await deleteUser(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 200,
      body: {
        success: true,
        message: "User deleted successfully",
      },
    };
    expect(actualResponse).toMatchObject(expectedResponse);
  });
  it("user not found response when delete a user", async () => {
    const authorizeUser = jest.fn(() => true);
    const removeUser = jest.fn(() => {
      throw Error("User not found");
    });
    const httpRequest = { query: { id: "1234" } };
    const deleteUser = makeDeleteUser({
      authorizeUser,
      removeUser,
      createResponse,
      handleError,
    });
    const actualResponse = await deleteUser(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 400,
      body: {
        success: false,
        message: "User not found",
      },
    };
    expect(actualResponse).toMatchObject(expectedResponse);
  });
});
