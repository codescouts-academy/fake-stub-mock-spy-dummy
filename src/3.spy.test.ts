import { Authenticator, Login } from "./Support";

export class AuthenticationSpy implements Authenticator {
    private count: number = 0;
    private result: boolean = false;
    private lastUserName: string = "";
    private lastPassword: string = "";

    public authenticate(userName: string, password: string): boolean {
        this.count++;
        this.lastUserName = userName;
        this.lastPassword = password;

        return this.result;
    }

    public get times(): number {
        return this.count;
    }

    public changeResult(newResult: boolean) {
        this.result = newResult;
    }

    public get lastUserNameUsed() {
        return this.lastUserName;
    }

    public get lastPasswordUsed() {
        return this.lastPassword;
    }
}

describe("Spy", () => {
    test("the user try to authenticate the authorizer authentication call once time", () => {
        const authenticationSpy = new AuthenticationSpy();
        authenticationSpy.changeResult(true);

        const login = new Login(authenticationSpy);

        const success = login.authorize("Wrong username", "Wrong password");

        expect(success).toBeTruthy();
        expect(authenticationSpy.times).toBe(1);
    })
})