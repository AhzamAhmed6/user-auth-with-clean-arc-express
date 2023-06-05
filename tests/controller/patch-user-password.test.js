import makePatchUserPassword from "../../src/controllers/patch-user-password";
import patchUserPasswordDependencies from "../../src/controller-helper/patch-user-password.heper";

describe("patchUserPassword", () => {
  it("User not present", async () => {
    const httpRequest = { user: false };
    const patchUserPassword = makePatchUserPassword(
      patchUserPasswordDependencies
    );
    const actualResponse = await patchUserPassword(httpRequest);
    const expectedResponse = {
      headers: { "Content-Type": "application/json" },
      statusCode: 400,
      body: { success: false, error: "Unauthorize" },
    };
    expect(actualResponse).toMatchObject(expectedResponse);
  });
});
