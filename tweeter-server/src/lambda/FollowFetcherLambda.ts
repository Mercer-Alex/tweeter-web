import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Status } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (event: any): Promise<void> => {
	for (let i = 0; i < event.Records.length; ++i) {
		const { body } = event.Records[i];

		let parsed = JSON.parse(body);

		let followerList: string[];

		try {
			followerList = await new FollowService().getFollowers(parsed._user._alias);

		} catch (error) {
			throw new Error(`[400] ${error}`)
		}
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

			try {
				const data = await sqsClient.send(new SendMessageCommand(params));
			} catch (err) {
				throw err;
			}
		}
	}
}
