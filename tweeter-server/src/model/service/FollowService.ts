import { AuthToken, User, Follow } from "tweeter-shared";
import { DaoService } from "./DaoService";

export class FollowService extends DaoService {

	public async loadMoreUsers(
		authToken: AuthToken,
		user: User,
		pageSize: number,
		lastItem: User | null,
		followees: boolean
	): Promise<[User[], boolean]> {
		let follows: [string[], boolean];
		let usersList: User[] = [];

		await this.checkAuthToken(authToken);

		if (followees) {
			follows = await this.followDao.getPageOfFollowees(user.alias, pageSize, lastItem?.alias);
		}
		else {
			follows = await this.followDao.getPageOfFollowers(user.alias, pageSize, lastItem?.alias);
		}

		for (const alias of follows[0]) {
			let userToAdd: User | null | undefined = await this.userDao.getUser(alias);
			usersList.push(userToAdd!);
		}

		return [usersList, follows[1]]
	};

	public async getIsFollowerStatus(
		authToken: AuthToken,
		user: User,
		selectedUser: User
	): Promise<boolean> {
		await this.checkAuthToken(authToken);

		const isFollower = await this.followDao.getFollow(new Follow(user, selectedUser));

		return isFollower;
	};

	public async getFolloweesCount(
		authToken: AuthToken,
		username: string
	): Promise<number> {
		await this.checkAuthToken(authToken);

		let count = await this.userDao.getFolloweesCount(username);

		if (count == null || count == undefined) {
			count = 0;
		}
		return count;
	};

	public async getFollowersCount(
		authToken: AuthToken,
		username: string
	): Promise<number> {
		let authResponse = await this.checkAuthToken(authToken);

		let count = await this.userDao.getFollowersCount(username);
		if (count == null || count == undefined) {
			count = 0;
		}

		return count;
	};

	public async follow(
		authToken: AuthToken,
		userToFollow: User
	): Promise<[followersCount: number, followeesCount: number]> {
		const authResponse = await this.checkAuthToken(authToken);

		const user = await this.userDao.getUser(authResponse[1]);
		await this.followDao.putFollow(new Follow(user!, userToFollow))
		await this.userDao.updateFolloweesCount(userToFollow._alias, 1);
		await this.userDao.updateFollowersCount(user?.alias!, -1);


		let followersCount = await this.getFollowersCount(authToken, userToFollow._alias);
		let followeesCount = await this.getFolloweesCount(authToken, userToFollow._alias);

		return [followersCount, followeesCount];
	};

	public async unfollow(
		authToken: AuthToken,
		userToUnfollow: User
	): Promise<[followersCount: number, followeesCount: number]> {
		const authResponse = await this.checkAuthToken(authToken);

		const user = await this.userDao.getUser(authResponse[1]);
		await this.followDao.putFollow(new Follow(user!, userToUnfollow))
		await this.userDao.updateFolloweesCount(userToUnfollow._alias, -1);
		await this.userDao.updateFollowersCount(user?.alias!, -1);


		let followersCount = await this.getFollowersCount(authToken, userToUnfollow._alias);
		let followeesCount = await this.getFolloweesCount(authToken, userToUnfollow._alias);

		return [followersCount, followeesCount];
	};

	public async getFollowers(username: string): Promise<string[]> {
		return await this.followDao.getFollowers(username);
	}
}
