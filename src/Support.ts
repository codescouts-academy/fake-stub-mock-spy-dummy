export interface Authenticator {
    authenticate(userName: string, password: string): boolean;
}
export class Login {
    constructor(private readonly authenticator: Authenticator) {

    }

    authorize(userName: string, password: string) {
        if (!userName || !password) throw Error("Username can not be empty");

        return this.authenticator.authenticate(userName, password);
    }
}