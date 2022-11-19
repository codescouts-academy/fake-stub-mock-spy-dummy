import { Authenticator, Login } from "./Support";

class AuthorizationFake implements Authenticator {
    public authenticate(userName: string, password: string): boolean {
        return userName === "Code" && password === "Scouts";
    }
}

describe("Fake", () => {
    test("authentication is rejected when username or password are incorrect", () => {
        const authorizationFake = new AuthorizationFake();
        const login = new Login(authorizationFake);

        const success = login.authorize("Wrong username", "Wrong password");

        expect(success).toBeFalsy();
    })

    test("authentication is success when username and password correct", () => {
        const authorizationFAke = new AuthorizationFake();
        const login = new Login(authorizationFAke);

        const success = login.authorize("Code", "Scouts");

        expect(success).toBeTruthy();
    })
})