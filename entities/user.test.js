import makeUser from "./";
// import buildMakeUser from "./user";
import makeFakeUser from "../__test__/fixtures/user.js";

describe("user", () => {
	test("unsatisfied firstName", () => {
		const user = makeFakeUser({ firstName: "" });
		expect(() => makeUser(user)).toThrow("First Name must not be empty");
	});

	test("unsatisfied lastName", () => {
		const user = makeFakeUser({ lastName: "" });
		expect(() => makeUser(user)).toThrow("Last Name must not be empty");
	});

	test("invalid email", () => {
		const user = makeFakeUser({ email: "ahzamahmed6gmail.com" });
		expect(() => makeUser(user)).toThrow(
			"ahzamahmed6gmail.com is not a valid email"
		);
	});

	test("unsatisfied password", () => {
		const user = makeFakeUser({ password: "1234" });
		expect(() => makeUser(user)).toThrow(
			"Password must contains min 8 letter password, with at least a symbol, upper and lower case letters and a number"
		);
	});

	test("Everything Correct", () => {
		const user = makeUser(makeFakeUser());
		expect(user.getFirstName()).toBe("Ahzam");
		expect(user.getLastName()).toBe("Ahmed");
		expect(user.getEmail()).toBe("ahzamahmed6@gmail.com");
		expect(user.getHashedPassword().slice(0, 7)).toBe("$2b$10$");
	});
});

// TODO Mock hashPassword Function
// const mockHashPassword = jest.fn((password) => "abc" + password + "abc");
// const makeUser1 = buildMakeUser({ mockHashPassword });
// const user = makeUser1(makeFakeUser());
// test("test hashPassword", () => {
// 	expect(user.getPassword()).toBe("sdf");
// });
