import { UnfollowRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


export const handler = async (event: UnfollowRequest): Promise<TweeterResponse> => {
	let response: TweeterResponse;

	try {
		await new FollowService().unfollow(event.authToken!, event.user)
		response = new TweeterResponse(true);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}
