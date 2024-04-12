import { FollowRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


export const handler = async (event: FollowRequest): Promise<TweeterResponse> => {
	let response: TweeterResponse;

	let request: FollowRequest = FollowRequest.fromJson(event);

	try {
		await new FollowService().unfollow(request._authToken!, request.user)
		response = new TweeterResponse(true);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}
