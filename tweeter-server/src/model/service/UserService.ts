import { AuthToken, User } from "tweeter-shared";
import { DaoService } from "./DaoService";
export class UserService extends DaoService {

	public async getUser(
		authToken: AuthToken,
		alias: string
	): Promise<User | undefined> {
		if (!await this.authTokenDao.checkAuthToken(authToken)) {
			throw new Error('Invalid auth token');
		}
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
			return [user!, authToken];
		}

		throw new Error("Could not login");
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
		await this.authDao.putAuthentication(username, password);

		const user = new User(firstName, lastName, username, imageUrl);
		await this.userDao.putUser(user, password);

		if (user === null) {
			throw new Error("Invalid registration");
		}

		return [user, authToken];
	};

	public async logout(authToken: AuthToken): Promise<void> {
		await this.authTokenDao.deleteAuthToken(authToken);
	};
}
