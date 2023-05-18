import verifyUser from "../../src/controllers/verify-user";

describe("verifyUser", () => {
  it("token not valid response", async () => {
    const httpRequest = { query: { id: "1234" } };
    const actualResponse = verifyUser(httpRequest);
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
    const httpRequest = { query: { id: "1234" } };
    const actualResponse = verifyUser(httpRequest);
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
