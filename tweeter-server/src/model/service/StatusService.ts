import { AuthToken, User, Status } from "tweeter-shared";
import { DaoService } from "./DaoService";

export class StatusService extends DaoService {
	public async loadMoreStatusItems(
		authToken: AuthToken,
		user: User,
		pageSize: number,
		lastItem: Status | null,
		story: boolean
	): Promise<[Status[], boolean]> {
		if (!await this.authTokenDao.checkAuthToken(authToken)) {
			throw new Error('Invalid auth token');
		}
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
		await this.storyDao.putStatus(newStatus);

		await this.feedDao.putStatus(newStatus);
	};
}
