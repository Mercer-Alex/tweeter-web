import { AuthToken, User, Status } from "tweeter-shared";
import { DaoService } from "./DaoService";

export interface ResponseFromDao {
	author_handle: string;
	time_stamp: number;
	post: string;
	follower_handle: string;
}
export class StatusService extends DaoService {

	public async loadMoreStatusItems(
		authToken: AuthToken,
		user: User,
		pageSize: number,
		lastItem: Status | null,
		story: boolean
	): Promise<[Status[], boolean]> {
		let statusList: Status[] = [];
		let response: [ResponseFromDao[], boolean];

		await this.checkAuthToken(authToken);

		if (story) {
			response = await this.storyDao.getPageofStatuses(user.alias, pageSize, lastItem);
		}
		else {
			response = await this.feedDao.getPageofStatuses(user.alias, pageSize, lastItem);
		}

		for (const futureStatus of response[0]) {
			let userForStatus: User | null | undefined = await this.userDao.getUser(futureStatus.author_handle);
			let statusToAdd = new Status(futureStatus.post, userForStatus!, futureStatus.time_stamp);

			statusList.push(statusToAdd);
		}

		return [statusList, response[1]]
	};

	public async postStatus(newStatus: Status, authToken: AuthToken): Promise<void> {
		await this.checkAuthToken(authToken);

		await this.storyDao.putStatus(newStatus);
	};

	public async postFeed(newStatus: Status, userList: string[]): Promise<void> {

		for (const username of userList) {
			await this.feedDao.putStatus(newStatus, newStatus._user._alias, username);
		}
	};
}
