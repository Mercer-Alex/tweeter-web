import { LoadMoreFeedItemsRequest, LoadMoreItemsResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";


export const handler = async (event: LoadMoreFeedItemsRequest): Promise<LoadMoreItemsResponse> => {
	let response: LoadMoreItemsResponse;

	try {
		response = new LoadMoreItemsResponse(
			true,
			...(await new StatusService().loadMoreFeedItems(
				event.authToken,
				event.user,
				event.pageSize,
				event.lastItem
			)),
			null
		);
	} catch (error) {
		throw new Error(`[Error] ${error as Error}.message`);
	}
	return response;
}
