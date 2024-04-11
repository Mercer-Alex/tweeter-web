import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";


export const handler = async (event: PostStatusRequest): Promise<TweeterResponse> => {
	let response: TweeterResponse;

	console.log('poststatus', event);

	try {
		await new StatusService().postStatus(event.newStatus);
		response = new TweeterResponse(true);
	} catch (error) {
		throw new Error(`[400] bad request: ${error}`);
	}
	return response;
}
