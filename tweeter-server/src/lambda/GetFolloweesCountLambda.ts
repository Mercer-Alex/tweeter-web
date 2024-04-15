import { GetFollowsCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: GetFollowsCountRequest): Promise<GetFollowCountResponse> => {
	let response: GetFollowCountResponse;
	console.log('get followees lambda', event);

	let request: GetFollowsCountRequest = GetFollowsCountRequest.fromJson(event);
	console.log('the request for followees', request);
	try {
		response = new GetFollowCountResponse(
			true,
			await new FollowService().getFolloweesCount(request._authToken!, request.user._alias),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}
