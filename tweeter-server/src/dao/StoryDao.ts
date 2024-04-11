import { Status } from "tweeter-shared";
import { StatusDaoInterface } from "./DaoInterface";
import {
	GetCommand,
	PutCommand,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import BaseDao from "./BaseDao";

export default class StoryDao extends BaseDao implements StatusDaoInterface {
	readonly tableName = "story";
	readonly indexNam = "story_index";
	readonly author_handleAttr: string = "author_handle";
	readonly postAttr = "post";
	readonly time_stampAttr = "time_stamp";


	async getPageofStatuses(username: string, pageSize: number, lastStatus: Status | null): Promise<[Status[], boolean]> {
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
				[this.time_stampAttr]: status.timestamp.toString(),
				[this.author_handleAttr]: username,
			},
		};
		console.log(params);
		await this.client.send(new PutCommand(params));
	}
}
