import { AuthenticationSpy } from "./3.spy.test";
import { Login } from "./Support";

class AuthenticatorMock extends AuthenticationSpy /* 👈 Extends previous Spy created */ {
    constructor(private readonly expectedUsername: string,
        private readonly expectedPassword: string,
        private readonly authenticateCalling: number) {
        super()
    }

    public validate(): boolean {
        return this.authenticateCalling === this.times &&
            this.expectedUsername === this.lastUserNameUsed &&
            this.expectedPassword === this.lastPasswordUsed;
    }
}

describe("Mock", () => {
    test("the login is correct when user and password are correct", () => {
        const authenticationMock = new AuthenticatorMock("Code", "Scouts", 1);
        authenticationMock.changeResult(true);
        const login = new Login(authenticationMock);

        const success = login.authorize("Code", "Scouts");

        expect(success).toBeTruthy();
        expect(authenticationMock.validate()).toBeTruthy();
    })
})