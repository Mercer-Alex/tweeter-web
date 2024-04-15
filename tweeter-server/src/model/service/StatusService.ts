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
			console.log('feed response', response);
		}
		console.log('the response', response)

		for (const futureStatus of response[0]) {
			let userForStatus: User | null | undefined = await this.userDao.getUser(futureStatus.author_handle);
			let statusToAdd = new Status(futureStatus.post, userForStatus!, futureStatus.time_stamp);

			console.log('individual', futureStatus);
			console.log(statusToAdd);

			statusList.push(statusToAdd);
		}

		return [statusList, response[1]]
	};


	public async postStatus(newStatus: Status, authToken: AuthToken): Promise<void> {
		await this.checkAuthToken(authToken);

		console.log('the new status', newStatus)

		await this.storyDao.putStatus(newStatus);

		const authorFollowers: string[] = await this.followDao.getFollowers(newStatus.user._alias);

		for (const follower of authorFollowers) {
			await this.feedDao.putStatus(newStatus, newStatus.user._alias, follower);
		}
	};
}
