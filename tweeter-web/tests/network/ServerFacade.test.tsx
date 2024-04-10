import { AuthToken, GetFolloweesCountRequest, GetFollowersCountRequest, LoadMoreFollowersRequest, LoadMoreFollowsResponse, LoadMoreStoryItemsRequest, RegisterRequest, User } from "tweeter-shared"
import { ServerFacade } from "../../src/model/net/ServerFacade"
import 'isomorphic-fetch'

describe('ServerFacade', () => {
	const serverFacade = new ServerFacade();
	const authToken = new AuthToken('token', Date.now());
	const imageString = new Uint8Array(2);
	const user = new User('firstName', 'lastName', 'alias', 'imageString');

	it.only('should register a new user when Register is called', async () => {
		const request = new RegisterRequest('alias', 'password', 'firstName', 'lastName', imageString);
		const response = await serverFacade.register(request);

		expect(response.success).toBe(true);
		expect(response.message).toBeNull();
		expect(response.token).not.toBeNull();
		expect(response.user).not.toBeNull();
	});

	it('should return 5 followers when calling LoadMoreFollowers', async () => {
		const PAGE_SIZE = 5;
		let lastItem: User | null = null;
		const request = new LoadMoreFollowersRequest(authToken, user, PAGE_SIZE, lastItem);
		const response = await serverFacade.loadMoreFollowers(request);

		expect(response.success).toBe(true);
		expect(response.message).toBeNull();
		expect(response.hasMoreItems).toBe(true);
		expect(response.itemsList.length).toBe(5);
	});

	it('should return how many followers there are when calling getFollowersCount', async () => {
		const request = new GetFollowersCountRequest(authToken, user);
		const response = await serverFacade.getFollowersCount(request);

		expect(response.success).toBe(true);
		expect(response.message).toBeNull();
	});

	it('should return how many followees there are when calling getFolloweesCount', async () => {
		const request = new GetFolloweesCountRequest(authToken, user);
		const response = await serverFacade.getFolloweesCount(request);

		expect(response.success).toBe(true);
		expect(response.message).toBeNull();
	});
});
