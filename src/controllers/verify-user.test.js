import verifyUserDependencies from "../controller-helper/verify-user.helper";
import makeVerifyUser from "./verify-user";
const { handleError } = verifyUserDependencies;

describe("verifyUser", () => {
  it("token not valid response", async () => {
    const validateUser = jest.fn(() => false);
    const verifyUser = makeVerifyUser({ validateUser, handleError });
    const httpRequest = { query: { id: "1234" } };
    const actualResponse = await verifyUser(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 200,
      body: {
        valid: false,
      },
    };
    expect(actualResponse).toMatchObject(expectedResponse);
  });

  it("valid token response", async () => {
    const validateUser = jest.fn(() => false);
    const verifyUser = makeVerifyUser({ validateUser, handleError });
    const httpRequest = { query: { id: "1234" } };
    const actualResponse = await verifyUser(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 200,
      body: {
        valid: false,
      },
    };
    expect(actualResponse).toMatchObject(expectedResponse);
  });
});
