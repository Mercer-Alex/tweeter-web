import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


export const handler = async (event: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
	let response: GetIsFollowerStatusResponse;

	let request: GetIsFollowerStatusRequest = GetIsFollowerStatusRequest.fromJson(event);

	try {
		const isFollower = await new FollowService().getIsFollowerStatus(request._authToken!, request.user, request.selectedUser)

		response = new GetIsFollowerStatusResponse(isFollower, true)
	} catch (error) {
		throw new Error(`[400] ${error}`)
	}

	return response;
}