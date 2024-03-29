import { LoadMoreFollowersRequest, LoadMoreFollowsResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: LoadMoreFollowersRequest): Promise<LoadMoreFollowsResponse> => {
	let response: LoadMoreFollowsResponse;

	try {
		response = new LoadMoreFollowsResponse(
			true,
			...(await new FollowService().loadMoreFollowers(
				event.authToken,
				event.user,
				event.pageSize,
				event.lastItem
			)),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}

	return response;
}
