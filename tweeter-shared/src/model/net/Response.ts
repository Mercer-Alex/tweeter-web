import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class TweeterResponse {
	private _success: boolean;
	private _message: string | null;

	constructor(success: boolean, message: string | null = null) {
		this._success = success;
		this._message = message;
	}

	get success() {
		return this._success;
	}

	get message() {
		return this._message;
	}

	static fromJson(json: JSON): TweeterResponse {
		interface TweeterResponseJson extends ResponseJson { }

		const jsonObject: TweeterResponseJson =
			json as unknown as TweeterResponseJson;

		return new TweeterResponse(
			jsonObject._success,
			jsonObject._message
		);
	}
}

interface ResponseJson {
	_success: boolean;
	_message: string;
}

export class AuthenticateResponse extends TweeterResponse {
	private _user: User;
	private _token: AuthToken;

	constructor(
		success: boolean,
		user: User,
		authToken: AuthToken,
		message: string | null = null
	) {
		super(success, message);
		this._user = user;
		this._token = authToken;
	}

	get user() {
		return this._user;
	}

	get token() {
		return this._token;
	}

	static fromJson(json: JSON): AuthenticateResponse {
		interface AuthenticateResponseJson extends ResponseJson {
			_user: JSON;
			_token: JSON;
		}

		const jsonObject: AuthenticateResponseJson =
			json as unknown as AuthenticateResponseJson;
		const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

		if (deserializedUser === null) {
			throw new Error(
				"AuthenticateResponse, could not deserialize user with json:\n" +
				JSON.stringify(jsonObject._user)
			);
		}

		const deserializedToken = AuthToken.fromJson(
			JSON.stringify(jsonObject._token)
		);

		if (deserializedToken === null) {
			throw new Error(
				"AuthenticateResponse, could not deserialize token with json:\n" +
				JSON.stringify(jsonObject._token)
			);
		}

		return new AuthenticateResponse(
			jsonObject._success,
			deserializedUser,
			deserializedToken,
			jsonObject._message
		);
	}
}

export class GetUserResponse extends TweeterResponse {
	private _user: User | null;

	constructor(
		success: boolean,
		user: User | null,
		message: string | null
	) {
		super(success, message);
		this._user = user;
	}

	get user() {
		return this._user;
	}

	static fromJson(json: JSON): GetUserResponse {
		interface GetUserResponseJson extends ResponseJson {
			_user: JSON;
		}

		const jsonObject: GetUserResponseJson =
			json as unknown as GetUserResponseJson;
		const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

		if (deserializedUser === null) {
			throw new Error(
				"GetUserResponse, could not deserialize user with json:\n" +
				JSON.stringify(jsonObject._user)
			);
		}

		return new GetUserResponse(
			jsonObject._success,
			deserializedUser,
			jsonObject._message
		);
	}
}

export class LoadMoreItemsResponse extends TweeterResponse {
	private _itemsList: Status[];
	private _hasMoreItems: boolean;

	constructor(
		success: boolean,
		itemsList: Status[],
		hasMoreItems: boolean,
		message: string | null
	) {
		super(success, message);
		this._itemsList = itemsList;
		this._hasMoreItems = hasMoreItems;
	}

	get itemsList() {
		return this._itemsList;
	}

	get hasMoreItems() {
		return this._hasMoreItems;
	}

	static fromJson(json: JSON): LoadMoreItemsResponse {
		interface LoadMoreItemsResponseJson extends ResponseJson {
			_itemsList: JSON[];
			_hasMoreItems: boolean;
		}

		const jsonObject: LoadMoreItemsResponseJson =
			json as unknown as LoadMoreItemsResponseJson;

		const deserializedStatusItems = jsonObject._itemsList.map(statusItem => {
			const deserializedStatus = Status.fromJson(JSON.stringify(statusItem));
			if (deserializedStatus === null) {
				throw new Error(
					"LoadMoreFeedItemsResponse, could not deserialize status with json:\n" +
					JSON.stringify(statusItem)
				);
			}
			return deserializedStatus
		})


		return new LoadMoreItemsResponse(
			jsonObject._success,
			deserializedStatusItems,
			jsonObject._hasMoreItems,
			jsonObject._message
		);
	}
}

export class LoadMoreFollowsResponse extends TweeterResponse {
	private _itemsList: User[];
	private _hasMoreItems: boolean;

	constructor(
		success: boolean,
		itemsList: User[],
		hasMoreItems: boolean,
		message: string | null
	) {
		super(success, message);
		this._itemsList = itemsList;
		this._hasMoreItems = hasMoreItems;
	}

	get itemsList() {
		return this._itemsList;
	}

	get hasMoreItems() {
		return this._hasMoreItems;
	}

	static fromJson(json: JSON): LoadMoreFollowsResponse {
		interface LoadMoreUserItemsResponse extends ResponseJson {
			_itemsList: JSON[];
			_hasMoreItems: boolean;
		}

		const jsonObject: LoadMoreUserItemsResponse =
			json as unknown as LoadMoreUserItemsResponse;

		const deserializedUserItems = jsonObject._itemsList.map(userItem => {
			const deserializedUser = User.fromJson(JSON.stringify(userItem));
			if (deserializedUser === null) {
				throw new Error(
					"LoadMoreFeedUserResponse, could not deserialize status with json:\n" +
					JSON.stringify(userItem)
				);
			}
			return deserializedUser
		})

		return new LoadMoreFollowsResponse(
			jsonObject._success,
			deserializedUserItems,
			jsonObject._hasMoreItems,
			jsonObject._message
		);
	}
}

export class GetIsFollowerStatusResponse extends TweeterResponse {
	_isFollower: boolean

	constructor(isFollower: boolean, success: boolean, message: string | null = null) {
		super(success, message)
		this._isFollower = isFollower
	}

	get followStatus() {
		return this._isFollower;
	}


	static fromJson(json: JSON): GetIsFollowerStatusResponse {
		interface GetIsFollowerStatusResponseJson extends ResponseJson {
			_isFollower: boolean
		}

		const jsonObject: GetIsFollowerStatusResponseJson =
			json as unknown as GetIsFollowerStatusResponseJson

		return new GetIsFollowerStatusResponse(
			jsonObject._isFollower,
			jsonObject._success,
			jsonObject._message
		)
	}
}

export class GetFollowCountResponse extends TweeterResponse {
	private _count: number;

	constructor(success: boolean, count: number, message: string | null) {
		super(success, message);
		this._count = count;
	}

	get count() {
		return this._count;
	}

	static fromJson(json: JSON): GetFollowCountResponse {
		interface GetFollowCountResponseJson extends ResponseJson {
			_count: number;
		}

		const jsonObject: GetFollowCountResponseJson =
			json as unknown as GetFollowCountResponseJson;

		return new GetFollowCountResponse(
			jsonObject._success,
			jsonObject._count,
			jsonObject._message
		);
	}
}