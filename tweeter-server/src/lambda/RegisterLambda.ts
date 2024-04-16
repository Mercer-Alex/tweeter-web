import { RegisterRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: RegisterRequest): Promise<AuthenticateResponse> => {
	let response: AuthenticateResponse;

	let request: RegisterRequest = RegisterRequest.fromJson(event);

	try {
		response = new AuthenticateResponse(
			true,
			...(await new UserService().register(
				request._username,
				request.password,
				request.firstName,
				request.lastName,
				request.image)),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}