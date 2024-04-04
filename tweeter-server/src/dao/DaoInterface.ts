import { AuthToken, Follow, User } from "tweeter-shared";

export interface AuthDaoInterface {
	putAuthentication(username: string, password: string): Promise<void>;
	authenticate(username: string, password: string): Promise<boolean>;
}

export interface FollowDaoInterface {
	getPageOfFollowers(followerHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[string[], boolean]>;
	getPageOfFollowees(followeeHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[string[], boolean]>;
	putFollow(follow: Follow): Promise<void>;
	getFollow(follow: Follow): Promise<boolean>;
	deleteFollow(follow: Follow): Promise<void>;
}

export interface UserDaoInterface {
	updateFollowersCount(username: string, value: number): Promise<void>;
	updateFolloweesCount(username: string, value: number): Promise<void>;
	getFollowersCount(username: string): Promise<number>;
	getFolloweesCount(username: string): Promise<number>;
	getUser(username: string): Promise<User | undefined>;
	putUser(user: User): Promise<boolean>;
	deleteUser(username: string): Promise<void>;
}

export interface AuthTokenDaoInterface {
	putAuthToken(token: AuthToken, username: string): Promise<void>;
	deleteAuthToken(token: AuthToken): Promise<void>;
	checkAuthToken(token: AuthToken): Promise<[AuthToken, string] | [undefined, undefined]>;
}
