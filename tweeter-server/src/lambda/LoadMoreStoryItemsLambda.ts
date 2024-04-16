import { LoadMoreStatusItemsRequest, LoadMoreItemsResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";


export const handler = async (event: LoadMoreStatusItemsRequest): Promise<LoadMoreItemsResponse> => {
	let response: LoadMoreItemsResponse;
	let request: LoadMoreStatusItemsRequest = LoadMoreStatusItemsRequest.fromJson(event);

	try {
		response = new LoadMoreItemsResponse(
			true,
			...(await new StatusService().loadMoreStatusItems(
				request._authToken!,
				request.user,
				request.pageSize,
				request.lastItem,
				true
			)),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}
