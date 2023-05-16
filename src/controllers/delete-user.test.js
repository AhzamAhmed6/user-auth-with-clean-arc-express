import makeDeleteUser from "./delete-user.js";
import deleteUserDependencies from "../controller-helper/delete-user.helper.js";

const { createNotFoundResponse, createSuccessResponse, handleError } =
  deleteUserDependencies;

describe("deleteUser", () => {
  it("successfully deleted message", async () => {
    const authorizeUser = jest.fn(() => true);
    const removeUser = jest.fn(() => 1);
    const httpRequest = { query: { id: "1234" } };
    const deleteUser = makeDeleteUser({
      authorizeUser,
      removeUser,
      createNotFoundResponse,
      createSuccessResponse,
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
  it("do not have permission response", async () => {
    const authorizeUser = jest.fn(() => false);
    const removeUser = jest.fn(() => null);
    const httpRequest = { query: { id: "1234" } };
    const deleteUser = makeDeleteUser({
      authorizeUser,
      removeUser,
      createNotFoundResponse,
      createSuccessResponse,
      handleError,
    });
    const actualResponse = await deleteUser(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 400,
      body: {
        success: false,
        message: "You do not have permission to perform this action",
      },
    };
    expect(actualResponse).toMatchObject(expectedResponse);
  });
  it("user not found response when delete a user", async () => {
    const authorizeUser = jest.fn(() => true);
    const removeUser = jest.fn(() => 0);
    const httpRequest = { query: { id: "1234" } };
    const deleteUser = makeDeleteUser({
      authorizeUser,
      removeUser,
      createNotFoundResponse,
      createSuccessResponse,
      handleError,
    });
    const actualResponse = await deleteUser(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 404,
      body: {
        success: false,
        message: "User not found",
      },
    };
    expect(actualResponse).toMatchObject(expectedResponse);
  });
});
