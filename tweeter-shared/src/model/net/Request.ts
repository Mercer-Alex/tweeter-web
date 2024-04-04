import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class TweeterRequest {
	public _username: string;
	public _authToken: AuthToken | undefined;

	constructor(username: string, authToken: AuthToken | undefined) {
		this._authToken = authToken;
		this._username = username;
	}

	static fromJson(json: JSON): TweeterRequest {
		interface TweeterRequestJson {
			_username: string;
			_authToken: AuthToken;
		}

		const jsonObject: TweeterRequestJson =
			json as unknown as TweeterRequestJson;

		return new TweeterRequest(
			jsonObject._username,
			jsonObject._authToken
		);
	}
}

export class LoginRequest extends TweeterRequest {
	password: string;

	constructor(username: string, password: string) {
		super(username, undefined);
		this.password = password;
	}

	static fromJson(json: JSON): LoginRequest {
		interface LoginRequestJson {
			_username: string;
			password: string;
		}

		const jsonObject: LoginRequestJson =
			json as unknown as LoginRequestJson;

		return new LoginRequest(
			jsonObject._username,
			jsonObject.password,
		);
	}
}

export class LogoutRequest extends TweeterRequest {

	constructor(authToken: AuthToken) {
		super('', authToken);
	}

	static fromJson(json: JSON): LogoutRequest {
		interface LogoutRequestJson {
			_authToken: AuthToken;
		}

		const jsonObject: LogoutRequestJson =
			json as unknown as LogoutRequestJson;

		return new LogoutRequest(
			jsonObject._authToken!,
		);
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
		image: string
	) {
		super(username, password);
		this.firstName = firstName;
		this.lastName = lastName;
		this.image = image;
	}

	static fromJson(json: JSON): RegisterRequest {
		interface RegisterRequestJson {
			_username: string,
			password: string,
			firstName: string,
			lastName: string,
			image: string
		}

		const jsonObject: RegisterRequestJson =
			json as unknown as RegisterRequestJson;

		return new RegisterRequest(
			jsonObject._username,
			jsonObject.password,
			jsonObject.firstName,
			jsonObject.lastName,
			jsonObject.image,
		);
	}
}

export class GetUserRequest extends TweeterRequest {

	constructor(auth: AuthToken, username: string) {
		super(username, auth);
	}

	static fromJson(json: JSON): GetUserRequest {
		interface GetUserRequestJson {
			_authToken: AuthToken;
			_username: string;
		}

		const jsonObject: GetUserRequestJson =
			json as unknown as GetUserRequestJson;

		return new GetUserRequest(
			jsonObject._authToken!,
			jsonObject._username,
		);
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
		super('', authToken);
		this.user = user;
		this.pageSize = pageSize;
		this.lastItem = lastItem;
	}

	static fromJson(json: JSON): LoadMoreFeedItemsRequest {
		interface LoadMoreFeedItemsRequestJson {
			_authToken: AuthToken,
			user: User,
			pageSize: number,
			lastItem: Status | null
		}

		const jsonObject: LoadMoreFeedItemsRequestJson =
			json as unknown as LoadMoreFeedItemsRequestJson;

		return new LoadMoreFeedItemsRequest(
			jsonObject._authToken!,
			jsonObject.user,
			jsonObject.pageSize,
			jsonObject.lastItem,
		);
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
		super('', authToken);
		this.user = user;
		this.pageSize = pageSize;
		this.lastItem = lastItem;
	}

	static fromJson(json: JSON): LoadMoreStoryItemsRequest {
		interface LoadMoreStoryItemsRequestJson {
			_authToken: AuthToken,
			user: User,
			pageSize: number,
			lastItem: Status | null
		}

		const jsonObject: LoadMoreStoryItemsRequestJson =
			json as unknown as LoadMoreStoryItemsRequestJson;

		return new LoadMoreStoryItemsRequest(
			jsonObject._authToken!,
			jsonObject.user,
			jsonObject.pageSize,
			jsonObject.lastItem,
		);
	}
}

export class PostStatusRequest extends TweeterRequest {
	public newStatus: Status;

	constructor(authToken: AuthToken, newStatus: Status) {
		super('', authToken);
		this.newStatus = newStatus;
	}

	static fromJson(json: JSON): PostStatusRequest {
		interface PostStatusRequestJson {
			_authToken: AuthToken;
			newStatus: Status;
		}

		const jsonObject: PostStatusRequestJson =
			json as unknown as PostStatusRequestJson;

		return new PostStatusRequest(
			jsonObject._authToken!,
			jsonObject.newStatus,
		);
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

	static fromJson(json: JSON): LoadMoreFollowersRequest {
		interface LoadMoreFollowersRequestJson {
			_authToken: AuthToken,
			user: User,
			pageSize: number,
			lastItem: User | null
		}

		const jsonObject: LoadMoreFollowersRequestJson =
			json as unknown as LoadMoreFollowersRequestJson;

		return new LoadMoreFollowersRequest(
			jsonObject._authToken!,
			jsonObject.user,
			jsonObject.pageSize,
			jsonObject.lastItem,
		);
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

	static fromJson(json: JSON): LoadMoreFollowersRequest {
		interface LoadMoreFollowersRequestJson {
			_authToken: AuthToken,
			user: User,
			pageSize: number,
			lastItem: User | null
		}

		const jsonObject: LoadMoreFollowersRequestJson =
			json as unknown as LoadMoreFollowersRequestJson;

		return new LoadMoreFollowersRequest(
			jsonObject._authToken!,
			jsonObject.user,
			jsonObject.pageSize,
			jsonObject.lastItem,
		);
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

	static fromJson(json: JSON): GetIsFollowerStatusRequest {
		interface GetIsFollowerStatusRequestJson {
			_authToken: AuthToken;
			user: User;
			selectedUser: User;
		}

		const jsonObject: GetIsFollowerStatusRequestJson =
			json as unknown as GetIsFollowerStatusRequestJson;

		return new GetIsFollowerStatusRequest(
			jsonObject._authToken,
			jsonObject.user,
			jsonObject.selectedUser,
		);
	}
}

export class GetFolloweesCountRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}

	static fromJson(json: JSON): GetFolloweesCountRequest {
		interface GetFolloweesCountRequestJson {
			_authToken: AuthToken;
			user: User;
		}

		const jsonObject: GetFolloweesCountRequestJson =
			json as unknown as GetFolloweesCountRequestJson;

		return new GetFolloweesCountRequest(
			jsonObject._authToken,
			jsonObject.user,
		);
	}
}

export class GetFollowersCountRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}

	static fromJson(json: JSON): GetFollowersCountRequest {
		interface GetFollowersCountRequestRequestJson {
			_authToken: AuthToken;
			user: User;
		}

		const jsonObject: GetFollowersCountRequestRequestJson =
			json as unknown as GetFollowersCountRequestRequestJson;

		return new GetFollowersCountRequest(
			jsonObject._authToken,
			jsonObject.user,
		);
	}
}

export class FollowRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}

	static fromJson(json: JSON): FollowRequest {
		interface FollowRequestRequestJson {
			_authToken: AuthToken;
			user: User;
		}

		const jsonObject: FollowRequestRequestJson =
			json as unknown as FollowRequestRequestJson;

		return new FollowRequest(
			jsonObject._authToken,
			jsonObject.user,
		);
	}
}

export class UnfollowRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}

	static fromJson(json: JSON): UnfollowRequest {
		interface UnfollowRequestRequestJson {
			_authToken: AuthToken;
			user: User;
		}

		const jsonObject: UnfollowRequestRequestJson =
			json as unknown as UnfollowRequestRequestJson;

		return new UnfollowRequest(
			jsonObject._authToken,
			jsonObject.user,
		);
	}
}

