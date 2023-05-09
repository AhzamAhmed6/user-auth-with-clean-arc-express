import makeDeleteUser from "./delete-user.js";

const mockVerifyToken = jest.fn();
const mockRemoveUser = jest.fn();

const makeSut = () => {
  const deleteUser = makeDeleteUser({
    verifyToken: mockVerifyToken,
    removeUser: mockRemoveUser,
  });
  return { deleteUser };
};

describe("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 400 status code and an error message if the user is not authorized to delete the specified user", async () => {
    const { deleteUser } = makeSut();
    const httpRequest = {
      query: { id: "123" },
      user: { userId: "456" },
    };
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 400,
      body: {
        success: false,
        error: "You do not have permission to perform this action",
      },
    };

    const actualResponse = await deleteUser(httpRequest);

    expect(mockVerifyToken).not.toHaveBeenCalled();
    expect(mockRemoveUser).not.toHaveBeenCalled();
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should return a 404 status code and a 'User not found' message if the user to be deleted is not found", async () => {
    mockVerifyToken.mockResolvedValueOnce({ userId: "123" });
    mockRemoveUser.mockResolvedValueOnce(0);
    const { deleteUser } = makeSut();
    const httpRequest = {
      query: { id: "123" },
      user: { userId: "123" },
    };
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 404,
      body: { success: true, message: "User not found" },
    };

    const actualResponse = await deleteUser(httpRequest);

    expect(mockRemoveUser).toHaveBeenCalledWith({ id: "123" });
    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should return a 200 status code and a 'User deleted successfully' message if the user is successfully deleted", async () => {
    mockVerifyToken.mockResolvedValueOnce({ userId: "123" });
    mockRemoveUser.mockResolvedValueOnce(1);
    const { deleteUser } = makeSut();
    const httpRequest = {
      query: { id: "123" },
      user: { userId: "123" },
    };
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 200,
      body: { success: true, message: "User deleted successfully" },
    };

    const actualResponse = await deleteUser(httpRequest);

    expect(mockRemoveUser).toHaveBeenCalledWith({ id: "123" });
    expect(actualResponse).toEqual(expectedResponse);
  });

  test("should return a 400 status code and an error message if an Error is thrown", async () => {
    const error = new Error("Invalid input.");
    const httpRequest = { query: { id: "123" }, user: { userId: "456" } };
    const removeUser = jest.fn().mockRejectedValueOnce(error);
    const deleteUser = makeDeleteUser({ verifyToken: jest.fn(), removeUser });
    const { statusCode, body } = await deleteUser(httpRequest);
    expect(statusCode).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "You do not have permission to perform this action",
    });
  });
});
