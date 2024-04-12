import {
	LoginRequest,
	AuthenticateResponse,
	RegisterRequest,
	LogoutRequest,
	TweeterResponse,
	GetUserRequest,
	GetUserResponse,
	LoadMoreStatusItemsRequest,
	LoadMoreItemsResponse,
	LoadMoreFollowsRequest,
	LoadMoreFollowsResponse,
	PostStatusRequest,
	GetIsFollowerStatusRequest,
	GetIsFollowerStatusResponse,
	GetFollowCountResponse,
	FollowRequest,
	GetFollowsCountRequest
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";


export class ServerFacade {

	private SERVER_URL = "https://24hemn1gv4.execute-api.us-east-1.amazonaws.com/dev/";

	private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

	async login(request: LoginRequest): Promise<AuthenticateResponse> {
		const endpoint = "service/login";
		const response: JSON = await this.clientCommunicator.doPost<LoginRequest>(request, endpoint);

		return AuthenticateResponse.fromJson(response);
	}

	async register(request: RegisterRequest): Promise<AuthenticateResponse> {
		const endpoint = "service/register";
		const response: JSON = await this.clientCommunicator.doPost<RegisterRequest>(request, endpoint);

		return AuthenticateResponse.fromJson(response);
	}

	async logout(request: LogoutRequest): Promise<TweeterResponse> {
		const endpoint = "service/logout";
		const response: JSON = await this.clientCommunicator.doPost<LogoutRequest>(request, endpoint);

		return TweeterResponse.fromJson(response);
	}

	async getUser(request: GetUserRequest): Promise<GetUserResponse> {
		const endpoint = "get/user";
		const response: JSON = await this.clientCommunicator.doPost<GetUserRequest>(request, endpoint);

		return GetUserResponse.fromJson(response);
	}

	async loadMoreFeedItems(request: LoadMoreStatusItemsRequest): Promise<LoadMoreItemsResponse> {
		const endpoint = "get/feed";
		const response: JSON = await this.clientCommunicator.doPost<LoadMoreStatusItemsRequest>(request, endpoint);

		return LoadMoreItemsResponse.fromJson(response);
	}

	async loadMoreStoryItems(request: LoadMoreStatusItemsRequest): Promise<LoadMoreItemsResponse> {
		const endpoint = "get/story";
		const response: JSON = await this.clientCommunicator.doPost<LoadMoreStatusItemsRequest>(request, endpoint);

		return LoadMoreItemsResponse.fromJson(response);
	}

	async loadMoreFollowers(request: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> {
		const endpoint = "get/followers";
		const response: JSON = await this.clientCommunicator.doPost<LoadMoreFollowsRequest>(request, endpoint);

		return LoadMoreFollowsResponse.fromJson(response);
	}

	async loadMoreFollowees(request: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> {
		const endpoint = "get/followees";
		const response: JSON = await this.clientCommunicator.doPost<LoadMoreFollowsRequest>(request, endpoint);

		return LoadMoreFollowsResponse.fromJson(response);
	}

	async postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
		const endpoint = "service/post";
		const response: JSON = await this.clientCommunicator.doPost<PostStatusRequest>(request, endpoint);

		return TweeterResponse.fromJson(response);
	}

	async getIsFollowerStatus(request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> {
		const endpoint = "get/isfollowing";
		const response: JSON = await this.clientCommunicator.doPost<GetIsFollowerStatusRequest>(request, endpoint);

		return GetIsFollowerStatusResponse.fromJson(response);
	}

	async getFolloweesCount(request: GetFollowsCountRequest): Promise<GetFollowCountResponse> {
		const endpoint = "get/followeescount";
		const response: JSON = await this.clientCommunicator.doPost<GetFollowsCountRequest>(request, endpoint);

		return GetFollowCountResponse.fromJson(response);
	}

	async getFollowersCount(request: GetFollowsCountRequest): Promise<GetFollowCountResponse> {
		const endpoint = "get/followerscount";
		const response: JSON = await this.clientCommunicator.doPost<GetFollowsCountRequest>(request, endpoint);

		return GetFollowCountResponse.fromJson(response);
	}

	async follow(request: FollowRequest): Promise<TweeterResponse> {
		const endpoint = "service/follow";
		const response: JSON = await this.clientCommunicator.doPost<FollowRequest>(request, endpoint);

		return TweeterResponse.fromJson(response);
	}

	async unfollow(request: FollowRequest): Promise<TweeterResponse> {
		const endpoint = "unfollow";
		const response: JSON = await this.clientCommunicator.doPost<FollowRequest>(request, endpoint);

		return TweeterResponse.fromJson(response);
	}
}
