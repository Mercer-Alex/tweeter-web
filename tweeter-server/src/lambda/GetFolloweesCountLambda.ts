import { GetFollowsCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: GetFollowsCountRequest): Promise<GetFollowCountResponse> => {
	let response: GetFollowCountResponse;

	let request: GetFollowsCountRequest = GetFollowsCountRequest.fromJson(event);
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
