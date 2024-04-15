import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";


export const handler = async (event: PostStatusRequest): Promise<TweeterResponse> => {
	let response: TweeterResponse;

	let request: PostStatusRequest = PostStatusRequest.fromJson(event);

	try {
		await new StatusService().postStatus(request.newStatus, request._authToken!);
		response = new TweeterResponse(true);
	} catch (error) {
		throw new Error(`[400] bad request: ${error}`);
	}
	return response;
}
