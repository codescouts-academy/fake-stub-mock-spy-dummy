import { Authenticator, Login } from "./Support";

class AuthenticatorDummy implements Authenticator {
    public authenticate(userName: string, password: string): boolean {
        throw new Error("Not implemented");
    }
}

describe("Dummy", () => {
    test("get exception if username is empty", () => {
        const authenticatorDummy = new AuthenticatorDummy();
        const login = new Login(authenticatorDummy);

        const authorize = () => login.authorize("", "Some password");

        expect(authorize).toThrow("Username can not be empty");
    })
})