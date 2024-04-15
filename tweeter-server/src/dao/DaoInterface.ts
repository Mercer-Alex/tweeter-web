import { Follow, User, AuthToken, Status } from "tweeter-shared";

export interface AuthDaoInterface {
	putAuthentication(username: string, password: string): Promise<void>;
	authenticate(username: string, password: string): Promise<boolean>;
}

export interface FollowDaoInterface {
	getPageOfFollowers(followerHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[String[], boolean]>;
	getPageOfFollowees(followeeHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[String[], boolean]>;
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
	putUser(user: User, password: string): Promise<boolean>;
	deleteUser(username: string): Promise<void>;
}

export interface AuthTokenDaoInterface {
	putAuthToken(authToken: AuthToken, username: string): Promise<void>;
	deleteAuthToken(authToken: AuthToken): Promise<void>;
	checkAuthToken(authToken: AuthToken): Promise<[AuthToken, string] | [undefined, undefined]>;
}

export interface S3DaoInterface {
	putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}

export interface StatusDaoInterface {
	getPageofStatuses(username: string, pageSize: number, lastItem: Status | null): Promise<[any[], boolean]>;
	getStatus(status: Status, username: string): Promise<Status | undefined>;
	putStatus(status: Status, username: string): Promise<void>;
}
