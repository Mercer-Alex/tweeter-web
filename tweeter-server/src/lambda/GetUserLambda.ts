import { UserService } from "../model/service/UserService";
import { GetUserRequest, GetUserResponse } from "tweeter-shared";


export const handler = async (event: GetUserRequest): Promise<GetUserResponse> => {
	let response: GetUserResponse;

	let request: GetUserRequest = GetUserRequest.fromJson(event);

	try {
		const user = await new UserService().getUser(request._authToken!, request._username);

		if (!user) {
			response = new GetUserResponse(
				false, null, "User not found"
			);
		} else {
			response = new GetUserResponse(
				true, user, "User found!"
			);
		}

		return response;
	} catch (error) {
		throw new Error(`[400] ${error}`)
	}
}