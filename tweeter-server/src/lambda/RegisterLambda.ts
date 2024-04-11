import { RegisterRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: RegisterRequest): Promise<AuthenticateResponse> => {
	let response: AuthenticateResponse;
	try {
		response = new AuthenticateResponse(
			true,
			...(await new UserService().register(event._username, event.password, event.firstName, event.lastName, event.image)),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}