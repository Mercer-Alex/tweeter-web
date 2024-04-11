import { AuthToken, User } from "tweeter-shared";
import { DaoService } from "./DaoService";

export class UserService extends DaoService {

	public async getUser(
		authToken: AuthToken,
		alias: string
	): Promise<User | undefined> {
		const getUser: User | undefined = await this.userDao.getUser(alias);

		return getUser;
	};

	public async login(
		username: string,
		password: string
	): Promise<[User, AuthToken]> {

		const authenticate = await this.authDao.authenticate(username, password)

		if (authenticate) {
			const user: User | undefined = await this.userDao.getUser(username);
			if (user === undefined) {
				throw new Error("User is undefined, invalid username");
			}
			const authToken = AuthToken.Generate();
			await this.authTokenDao.putAuthToken(authToken, username);
			console.log("login", authToken);

			return [user!, authToken];
		}

		throw new Error("Could not authenticate");
	};

	public async register(
		username: string,
		password: string,
		firstName: string,
		lastName: string,
		userImageBytes: string
	): Promise<[User, AuthToken]> {

		const imageUrl = await this.s3Dao.putImage(username, userImageBytes);

		const authToken = AuthToken.Generate();
		await this.authTokenDao.putAuthToken(authToken, username);

		const user = new User(firstName, lastName, username, imageUrl);
		await this.userDao.putUser(user, password);

		if (user === null) {
			throw new Error("Invalid registration");
		}

		return [user, authToken];
	};

	public async logout(authToken: AuthToken): Promise<void> {
		console.log("logout", authToken);
		await this.authTokenDao.deleteAuthToken(authToken);
		// Pause so we can see the logging out message. Delete when the call to the server is implemented.
		await new Promise((res) => setTimeout(res, 1000));
	};

}