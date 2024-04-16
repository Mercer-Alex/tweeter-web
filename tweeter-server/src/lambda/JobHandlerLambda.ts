import { Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: any): Promise<void> => {
	let statusService = new StatusService();
	console.log('handler event', event);
	for (let i = 0; i < event.Records.length; ++i) {
		const { body } = event.Records[i];
		console.log('job handler', body);

		const parsed = JSON.parse(body);
		console.log('parsed body', parsed);

		await statusService.postFeed(parsed.status, parsed.usernameList);
	}
}
