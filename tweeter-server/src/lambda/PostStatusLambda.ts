import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";


export const handler = async (event: PostStatusRequest): Promise<TweeterResponse> => {
	let response: TweeterResponse;

	let request: PostStatusRequest = PostStatusRequest.fromJson(event);
	console.log("working status", request.newStatus);
	try {
		await new StatusService().postStatus(request.newStatus, request._authToken!);
		response = new TweeterResponse(true);
	} catch (error) {
		throw new Error(`[400] bad request: ${error}`);
	}

	let sqsClient = new SQSClient();
	const sqs_url = 'https://sqs.us-east-1.amazonaws.com/420424309972/cs340';

	const params = {
		DelaySeconds: 0,
		MessageBody: JSON.stringify(event.newStatus),
		QueueUrl: sqs_url,
	};

	try {
		const data = await sqsClient.send(new SendMessageCommand(params));
		console.log("Success, message sent. MessageID:", data.MessageId);
	} catch (err) {
		throw err;
	}

	return response;
}
