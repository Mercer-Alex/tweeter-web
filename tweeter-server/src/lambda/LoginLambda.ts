import { LoginRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
	let response: AuthenticateResponse;
	console.log('before request,', event);

	let request: LoginRequest = LoginRequest.fromJson(event);

	console.log('in handler', request);

	try {
		response = new AuthenticateResponse(
			true,
			...(await new UserService().login(request.username, request.password)),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}
