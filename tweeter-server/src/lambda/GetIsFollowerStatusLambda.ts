import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


export const handler = async (event: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
	let response: GetIsFollowerStatusResponse;

	try {
		const isFollower = await new FollowService().getIsFollowerStatus(event.authToken, event.user, event.selectedUser)

		response = new GetIsFollowerStatusResponse(isFollower, true)
	} catch (error) {
		throw new Error(`[400] ${error}`)
	}

	return response;
}