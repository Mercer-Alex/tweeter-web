import { Follow, User } from "tweeter-shared";

export interface AuthDaoInterface {
	putAuthentication(username: string, password: string): Promise<void>;
	authenticate(username: string, password: string): Promise<boolean>;
}

export interface FollowDaoInterface {
	getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[string[], boolean]>;
	getPageOfFollowees(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[string[], boolean]>;
	putFollow(follow: Follow): Promise<void>;
	getFollow(follow: Follow): Promise<boolean>;
	deleteFollow(follow: Follow): Promise<void>;
}

export interface UserDaoInterface {
	updateFollowersCount(alias: string, value: number): Promise<void>;
	updateFolloweesCount(alias: string, value: number): Promise<void>;
	getFollowersCount(alias: string): Promise<number>;
	getFolloweesCount(alias: string): Promise<number>;
	getUser(alias: string): Promise<User | undefined>;
	putUser(user: User): Promise<boolean>;
	deleteUser(alias: string): Promise<void>;
}