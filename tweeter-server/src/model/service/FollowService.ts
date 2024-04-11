import { AuthToken, User, FakeData } from "tweeter-shared";
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

		if (followees) {
			follows = await this.followDao.getPageOfFollowees(user.alias, pageSize, lastItem?.alias);
		}
		else {
			follows = await this.followDao.getPageOfFollowers(user.alias, pageSize, lastItem?.alias);
		}

		console.log('after running getPageOfFollowers', follows);

		follows[0].forEach(async alias => {
			console.log(alias);
			let userToAdd: User | null | undefined = await this.userDao.getUser(alias);
			console.log('user to add', userToAdd);
			usersList.push(userToAdd!);
		});

		console.log('userlist', usersList);


		return [usersList, follows[1]]

	};

	public async getIsFollowerStatus(
		authToken: AuthToken,
		user: User,
		selectedUser: User
	): Promise<boolean> {

		// TODO: Replace with the result of calling server
		return FakeData.instance.isFollower();
	};

	public async getFolloweesCount(
		authToken: AuthToken,
		user: User
	): Promise<number> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getFolloweesCount(user);
	};

	public async getFollowersCount(
		authToken: AuthToken,
		user: User
	): Promise<number> {
		// TODO: Replace with the result of calling server
		return FakeData.instance.getFollowersCount(user);
	};

	public async follow(
		authToken: AuthToken,
		userToFollow: User
	): Promise<[followersCount: number, followeesCount: number]> {
		// Pause so we can see the following message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server

		let followersCount = await this.getFollowersCount(authToken, userToFollow);
		let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

		return [followersCount, followeesCount];
	};

	public async unfollow(
		authToken: AuthToken,
		userToUnfollow: User
	): Promise<[followersCount: number, followeesCount: number]> {
		// Pause so we can see the unfollowing message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		// TODO: Call the server

		let followersCount = await this.getFollowersCount(authToken, userToUnfollow);
		let followeesCount = await this.getFolloweesCount(authToken, userToUnfollow);

		return [followersCount, followeesCount];
	};
}