import { LoadMoreFollowsRequest, LoadMoreFollowsResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> => {
	let response: LoadMoreFollowsResponse;
	console.log("in lambda", event);
	let request: LoadMoreFollowsRequest = LoadMoreFollowsRequest.fromJson(event);

	console.log('followers lambda', request);


	try {
		response = new LoadMoreFollowsResponse(
			true,
			...(await new FollowService().loadMoreUsers(
				request._authToken!,
				request.user,
				request.pageSize,
				request.lastItem,
				false
			)),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}

	return response;
}
