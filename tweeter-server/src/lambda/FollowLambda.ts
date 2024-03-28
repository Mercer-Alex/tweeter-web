import { FollowRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


export const handler = async (event: FollowRequest): Promise<TweeterResponse> => {
	let response: TweeterResponse;

	try {
		await new FollowService().follow(event.authToken!, event.user);
		response = new TweeterResponse(true);
	} catch (error) {
		throw new Error(`[Error] ${error}`);
	}

	return response;
}
