import { AuthToken, User, Status, PostStatusRequest } from "tweeter-shared";
import { DaoService } from "./DaoService";

export class StatusService extends DaoService {
	public async loadMoreStatusItems(
		authToken: AuthToken,
		user: User,
		pageSize: number,
		lastItem: Status | null,
		story: boolean
	): Promise<[Status[], boolean]> {
		if (story) {
			let followers: [Status[], boolean] = await this.storyDao.getPageofStatuses(user.alias, pageSize, lastItem);
			return [followers[0], followers[1]];
		}
		else {
			let followers: [Status[], boolean] = await this.feedDao.getPageofStatuses(user.alias, pageSize, lastItem);
			return [followers[0], followers[1]];
		}
	};


	public async postStatus(postRequest: PostStatusRequest): Promise<void> {
		// Pause so we can see the logging out message. Remove when connected to the server
		await new Promise((f) => setTimeout(f, 2000));

		await this.storyDao.putStatus(
			new Status(
				postRequest.newStatus.post,
				postRequest.newStatus.user,
				postRequest.newStatus.timestamp
			),
			postRequest.newStatus.user.alias);

		await this.feedDao.putStatus(
			new Status(
				postRequest.newStatus.post,
				postRequest.newStatus.user,
				postRequest.newStatus.timestamp),
			postRequest.newStatus.user.alias);

	};
}
