import { Status } from "tweeter-shared";
import { StatusDaoInterface } from "./DaoInterface";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";

export default class StatusDao implements StatusDaoInterface {
	readonly tableName = "story";
	readonly indexNam = "story_index";
	readonly author_handleAttr: string = "author_handle";
	readonly postAttr = "post";
	readonly time_stampAttr = "time_stamp";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


	async getPageofStatuses(username: string, pageSize: number): Promise<[Status[], boolean]> {
		const params = {
			TableName: this.tableName,
			KeyConditionExpression: 'author_handle = :author_handle',
			ExpressionAttributeValues: {
				':author_handle': username,
			},
			Limit: pageSize,
		}
		const items: Status[] = [];
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;

		data.Items?.forEach((item) =>
			items.push(Status.fromJson(this.postAttr)!)
		);

		return [items, hasMorePages]
	}

	async getStatus(status: Status, username: string): Promise<Status | undefined> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.author_handleAttr]: username,
				[this.time_stampAttr]: status.timestamp,
			},
		};
		const output = await this.client.send(new GetCommand(params));

		return output.Item == undefined
			? undefined
			: Status.fromJson(output.Item[this.postAttr])!;
	}

	async putStatus(status: Status, username: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.postAttr]: status.toJson,
				[this.time_stampAttr]: status.timestamp,
				[this.author_handleAttr]: username,
			},
		};
		await this.client.send(new PutCommand(params));
	}
}
