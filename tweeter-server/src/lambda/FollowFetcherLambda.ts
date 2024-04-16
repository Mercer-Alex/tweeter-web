import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Status } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: any): Promise<void> => {
	console.log('the event for fetcher', event);
	for (let i = 0; i < event.Records.length; ++i) {
		const { body } = event.Records[i];

		console.log('follower fetcher', body);
		let parsed = JSON.parse(body);

		let followerList: string[];

		try {
			followerList = await new FollowService().getFollowers(parsed._user._alias);
			console.log("follower list", followerList);

		} catch (error) {
			throw new Error(`[400] ${error}`)
		}
		console.log('the followers', followerList);
		let newStatus: Status = new Status(parsed._post, parsed._user, parsed._timestamp);

		let sqsClient = new SQSClient();
		const sqs_url = 'https://sqs.us-east-1.amazonaws.com/420424309972/jobsQ';

		while (followerList.length) {
			let tempFollowers = followerList.splice(0, 25);

			let messageBody = JSON.stringify({ ["status"]: newStatus, ["usernameList"]: tempFollowers });

			const params = {
				DelaySeconds: 0,
				MessageBody: messageBody,
				QueueUrl: sqs_url,
			};

			console.log('fetcher param', params);


			try {
				const data = await sqsClient.send(new SendMessageCommand(params));
				console.log("Success, message sent. MessageID:", data.MessageId);
			} catch (err) {
				throw err;
			}
		}
	}
}
