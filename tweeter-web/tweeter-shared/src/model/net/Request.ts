import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class TweeterRequest {
	public username: string;
	public authToken: AuthToken | undefined;

	constructor(username: string, authToken: AuthToken | undefined) {
		this.authToken = authToken;
		this.username = username;
	}
}

export class LoginRequest extends TweeterRequest {
	password: string;

	constructor(username: string, password: string) {
		super(username, undefined);
		this.password = password;
	}
}

export class LogoutRequest extends TweeterRequest {

	constructor(authToken: AuthToken) {
		super('', authToken);
	}
}

export class RegisterRequest extends LoginRequest {
	public firstName: string;
	public lastName: string;
	public image: string;

	constructor(
		username: string,
		password: string,
		firstName: string,
		lastName: string,
		image: string;
	) {
		super(username, password);
		this.firstName = firstName;
		this.lastName = lastName;
		this.image = image;
	}
}

export class GetUserRequest extends TweeterRequest {
	constructor(auth: AuthToken, username: string) {
		super(username, auth);
	}
}

export class LoadMoreFeedItemsRequest extends TweeterRequest {
	public user: User;
	public pageSize: number;
	public lastItem: Status | null;

	constructor(
		authToken: AuthToken,
		user: User,
		pageSize: number,
		lastItem: Status | null) {
		super(user.alias, authToken);
		this.user = user;
		this.pageSize = pageSize;
		this.lastItem = lastItem;
	}
}

export class LoadMoreStoryItemsRequest extends TweeterRequest {
	public user: User;
	public pageSize: number;
	public lastItem: Status | null;

	constructor(
		authToken: AuthToken,
		user: User,
		pageSize: number,
		lastItem: Status | null) {
		super(user.alias, authToken);
		this.user = user;
		this.pageSize = pageSize;
		this.lastItem = lastItem;
	}
}

export class PostStatusRequest extends TweeterRequest {
	public newStatus: Status;

	constructor(authToken: AuthToken, newStatus: Status) {
		super('', authToken);
		this.newStatus = newStatus;
	}
}

export class LoadMoreFollowersRequest extends TweeterRequest {
	public user: User;
	public pageSize: number;
	public lastItem: User | null;

	constructor(
		authToken: AuthToken,
		user: User,
		pageSize: number,
		lastItem: User | null) {
		super(user.alias, authToken);
		this.user = user;
		this.pageSize = pageSize;
		this.lastItem = lastItem
	}
}

export class LoadMoreFolloweesRequest extends TweeterRequest {
	public user: User;
	public pageSize: number;
	public lastItem: User | null;

	constructor(
		authToken: AuthToken,
		user: User,
		pageSize: number,
		lastItem: User | null) {
		super(user.alias, authToken);
		this.user = user;
		this.pageSize = pageSize;
		this.lastItem = lastItem
	}
}

export class GetIsFollowerStatusRequest extends TweeterRequest {
	public user: User;
	public selectedUser: User;

	constructor(authToken: AuthToken, user: User, selectedUser: User) {
		super(user.alias, authToken);
		this.user = user;
		this.selectedUser = selectedUser;
	}
}

export class GetFolloweesCountRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}
}

export class GetFollowersCountRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}
}

export class FollowRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}
}

export class UnfollowRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}
}

