import { GetFollowsCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


export const handler = async (event: GetFollowsCountRequest): Promise<GetFollowCountResponse> => {
	let response: GetFollowCountResponse;
	console.log('get followers count', event);
	let request: GetFollowsCountRequest = GetFollowsCountRequest.fromJson(event);
	console.log('followerw count request', request);

	try {
		response = new GetFollowCountResponse(
			true,
			await new FollowService().getFollowersCount(request._authToken!, request.user._alias),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}
