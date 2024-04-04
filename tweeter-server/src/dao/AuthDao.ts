import { AuthDaoInterface } from "./DaoInterface";

export default class AuthDao implements AuthDaoInterface {
	putAuthentication(username: string, password: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	authenticate(username: string, password: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

}