import { AuthToken, User, FakeData, Follow } from "tweeter-shared";
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

		this.checkAuthToken(authToken);
		console.log('the last item', lastItem);

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
		this.checkAuthToken(authToken);

		const isFollower = await this.followDao.getFollow(new Follow(user, selectedUser));

		return isFollower;
	};

	public async getFolloweesCount(
		authToken: AuthToken,
		user: User
	): Promise<number> {
		this.checkAuthToken(authToken);

		const count = await this.userDao.getFolloweesCount(user.alias);
		console.log('followees count', count);
		return FakeData.instance.getFolloweesCount(user);
	};

	public async getFollowersCount(
		authToken: AuthToken,
		user: User
	): Promise<number> {
		this.checkAuthToken(authToken);
		const count = await this.userDao.getFollowersCount(user.alias);

		return FakeData.instance.getFollowersCount(user);
	};

	public async follow(
		authToken: AuthToken,
		userToFollow: User
	): Promise<[followersCount: number, followeesCount: number]> {
		this.checkAuthToken(authToken);

		// Pause so we can see the following message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server
		// await this.followDao.follow

		let followersCount = await this.getFollowersCount(authToken, userToFollow);
		let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

		return [followersCount, followeesCount];
	};

	public async unfollow(
		authToken: AuthToken,
		userToUnfollow: User
	): Promise<[followersCount: number, followeesCount: number]> {
		this.checkAuthToken(authToken);

		// Pause so we can see the unfollowing message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server

		let followersCount = await this.getFollowersCount(authToken, userToUnfollow);
		let followeesCount = await this.getFolloweesCount(authToken, userToUnfollow);

		return [followersCount, followeesCount];
	};

	public async checkAuthToken(authToken: AuthToken) {
		if (!await this.authTokenDao.checkAuthToken(authToken)) {
			throw new Error('Invalid auth token');
		}
	}
}