import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: LogoutRequest): Promise<TweeterResponse> => {
	let response: TweeterResponse;

	console.log('in lambda');
	console.log(event);

	try {
		await new UserService().logout(event._authToken!);
		response = new TweeterResponse(true);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`)
	}
	return response;
}