import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: LogoutRequest): Promise<TweeterResponse> => {
	let response: TweeterResponse;

	let request: LogoutRequest = LogoutRequest.fromJson(event);
	console.log('the reqeuest', request);
	try {
		await new UserService().logout(request._authToken!);
		response = new TweeterResponse(true);
		console.log('the response', response);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`)
	}
	return response;
}