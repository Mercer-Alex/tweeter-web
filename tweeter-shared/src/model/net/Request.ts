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

	static fromJson(json: TweeterRequest): TweeterRequest {
		let deserializedAuth = AuthToken.fromJson(JSON.stringify(json._authToken))

		let deserializedUsername = '';
		if (json._username!) {
			deserializedUsername = json._username;
		}

		return new TweeterRequest(
			deserializedUsername,
			deserializedAuth!
		);
	}

	get username(): string {
		return this._username;
	}
	get authToken(): AuthToken {
		return this._authToken!;
	}
}

export class LoginRequest extends TweeterRequest {
	password: string;

	constructor(username: string, password: string) {
		super(username, undefined);
		this.password = password;
	}

	static fromJson(json: LoginRequest): LoginRequest {
		let deserializedUsername: string = json._username;
		let deserializedPassword: string = json.password;

		return new LoginRequest(
			deserializedUsername,
			deserializedPassword,
		);
	}
}

export class LogoutRequest extends TweeterRequest {

	constructor(authToken: AuthToken) {
		super('', authToken);
	}

	static fromJson(json: LogoutRequest): LogoutRequest {
		let deserializedAuth = AuthToken.fromJson(JSON.stringify(json._authToken))

		return new LogoutRequest(
			deserializedAuth!,
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

	static fromJson(json: RegisterRequest): RegisterRequest {
		let deserializedUsername: string = json._username;
		let deserializedPassword: string = json.password;
		let deserializedFirstName = json.firstName;
		let deserializedLastName: string = json.lastName;
		let deserializedImage: string = json.image;

		return new RegisterRequest(
			deserializedUsername,
			deserializedPassword,
			deserializedFirstName,
			deserializedLastName,
			deserializedImage,
		);
	}
}

export class GetUserRequest extends TweeterRequest {

	constructor(auth: AuthToken, username: string) {
		super(username, auth);
	}

	static fromJson(json: GetUserRequest): GetUserRequest {
		let deserializedAuth = AuthToken.fromJson(JSON.stringify(json._authToken));
		let deserializedUsername = json._username;

		return new GetUserRequest(
			deserializedAuth!,
			deserializedUsername!,
		);
	}
}

export class LoadMoreStatusItemsRequest extends TweeterRequest {
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

	static fromJson(json: LoadMoreStatusItemsRequest): LoadMoreStatusItemsRequest {
		let deserializedAuth = AuthToken.fromJson(JSON.stringify(json._authToken))
		let deserializedUser = User.fromJson(JSON.stringify(json.user));
		let deserializedPageSize = json.pageSize;
		let deserializedLastItem = undefined;

		if (json.lastItem != null) {
			deserializedLastItem = Status.fromJson(JSON.stringify(json.lastItem));
		}

		return new LoadMoreStatusItemsRequest(
			deserializedAuth!,
			deserializedUser!,
			deserializedPageSize,
			deserializedLastItem!,
		);
	}
}

export class PostStatusRequest extends TweeterRequest {
	public newStatus: Status;

	constructor(authToken: AuthToken, newStatus: Status) {
		super('', authToken);
		this.newStatus = newStatus;
	}

	static fromJson(json: PostStatusRequest): PostStatusRequest {
		let deserializedAuth = AuthToken.fromJson(JSON.stringify(json._authToken));
		let desializedStatus = Status.fromJson(JSON.stringify(json.newStatus));


		return new PostStatusRequest(
			deserializedAuth!,
			desializedStatus!,
		);
	}
}

export class LoadMoreFollowsRequest extends TweeterRequest {
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

	static fromJson(json: LoadMoreFollowsRequest): LoadMoreFollowsRequest {
		let deserializedAuth: AuthToken = AuthToken.fromJson(JSON.stringify(json._authToken))!;
		let deserializedUser: User = User.fromJson(JSON.stringify(json.user))!;
		let deserializedPageSize: number = json.pageSize;
		let deserializedLastItem: User | null = null;

		if (json.lastItem != null) {
			deserializedLastItem = User.fromJson(JSON.stringify(json.user));
		}

		return new LoadMoreFollowsRequest(
			deserializedAuth!,
			deserializedUser,
			deserializedPageSize,
			deserializedLastItem,
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

	static fromJson(json: GetIsFollowerStatusRequest): GetIsFollowerStatusRequest {
		let deserializedAuth: AuthToken = AuthToken.fromJson(JSON.stringify(json._authToken))!;
		let deserializedUser: User = User.fromJson(JSON.stringify(json.user))!;
		let deserializedSelectedUser: User = User.fromJson(JSON.stringify(json.selectedUser))!;

		return new GetIsFollowerStatusRequest(
			deserializedAuth,
			deserializedUser,
			deserializedSelectedUser,
		);
	}
}

export class GetFollowsCountRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}

	static fromJson(json: GetFollowsCountRequest): GetFollowsCountRequest {
		let deserializedAuth: AuthToken = AuthToken.fromJson(JSON.stringify(json._authToken))!;
		let deserializedUser: User = User.fromJson(JSON.stringify(json.user))!;

		return new GetFollowsCountRequest(
			deserializedAuth,
			deserializedUser,
		);
	}
}

export class FollowRequest extends TweeterRequest {
	public user: User;

	constructor(authToken: AuthToken, user: User) {
		super(user.alias, authToken);
		this.user = user;
	}

	static fromJson(json: FollowRequest): FollowRequest {
		let deserializedAuth: AuthToken = AuthToken.fromJson(JSON.stringify(json._authToken))!;
		let deserializedUser: User = User.fromJson(JSON.stringify(json.user))!;

		return new FollowRequest(
			deserializedAuth,
			deserializedUser,
		);
	}
}