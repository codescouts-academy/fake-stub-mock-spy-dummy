import { Authenticator, Login } from "./Support";

class RejectAuthorizer implements Authenticator {
    public authenticate(userName: string, password: string): boolean {
        return false;
    }
}

class SuccessAuthorizer implements Authenticator {
    public authenticate(userName: string, password: string): boolean {
        return true;
    }
}

describe("Stub", () => {
    test("authentication is rejected when username or password are incorrect", () => {
        const rejectAuthorizer = new RejectAuthorizer();
        const login = new Login(rejectAuthorizer);

        const success = login.authorize("Wrong username", "Wrong password");

        expect(success).toBeFalsy();
    })

    test("authentication is success when user name and password are correct", () => {
        const successAuthorizer = new SuccessAuthorizer();
        const login = new Login(successAuthorizer);

        const success = login.authorize("Wrong username", "Wrong password");

        expect(success).toBeTruthy();
    })
})