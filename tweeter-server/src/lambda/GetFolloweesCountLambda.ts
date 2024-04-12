import { GetFollowsCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: GetFollowsCountRequest): Promise<GetFollowCountResponse> => {
	let response: GetFollowCountResponse;

	try {
		response = new GetFollowCountResponse(
			true,
			await new FollowService().getFolloweesCount(event._authToken!, event.user),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}