import { GetFolloweesCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: GetFolloweesCountRequest): Promise<GetFollowCountResponse> => {
	let response: GetFollowCountResponse;

	try {
		response = new GetFollowCountResponse(
			true,
			await new FollowService().getFolloweesCount(event.authToken!, event.user),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}