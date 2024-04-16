import { Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: any): Promise<void> => {
	let statusService = new StatusService();
	for (let i = 0; i < event.Records.length; ++i) {
		const { body } = event.Records[i];

		const parsed = JSON.parse(body);

		await statusService.postFeed(parsed.status, parsed.usernameList);
	}
}
