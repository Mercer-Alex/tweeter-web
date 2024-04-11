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
		//TODO: check that authtoken is valid
		if (story) {
			let followers: [Status[], boolean] = await this.storyDao.getPageofStatuses(user.alias, pageSize, lastItem);
			return [followers[0], followers[1]];
		}
		else {
			let followers: [Status[], boolean] = await this.feedDao.getPageofStatuses(user.alias, pageSize, lastItem);
			return [followers[0], followers[1]];
		}
	};


	public async postStatus(newStatus: Status): Promise<void> {
		// await new Promise((f) => setTimeout(f, 2000));

		await this.storyDao.putStatus(newStatus);

		await this.feedDao.putStatus(newStatus);
	};
}
