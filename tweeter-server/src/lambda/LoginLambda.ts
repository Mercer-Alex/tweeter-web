import { LoginRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
	let response: AuthenticateResponse;
	try {
		response = new AuthenticateResponse(
			true,
			...(await new UserService().login(event.username, event.password)),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}
