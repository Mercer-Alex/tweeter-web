import { Status } from "tweeter-shared";
import { StatusDaoInterface } from "./DaoInterface";
import {
	GetCommand,
	PutCommand,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import BaseDao from "./BaseDao";

export default class FeedDao extends BaseDao implements StatusDaoInterface {
	readonly tableName = "feed";
	readonly indexNam = "feed_index";
	readonly author_handleAttr: string = "author_handle";
	readonly postAttr = "post";
	readonly time_stampAttr = "time_stamp";

	async getPageofStatuses(username: string, pageSize: number, lastItem: Status | null): Promise<[Status[], boolean]> {
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

	async putStatus(status: Status): Promise<void> {
		let time = new Date(status._timestamp).toDateString();

		const params = {
			TableName: this.tableName,
			Item: {
				[this.postAttr]: status._post,
				[this.time_stampAttr]: time,
				[this.author_handleAttr]: status._user._alias,
			},
		};
		await this.client.send(new PutCommand(params));
	}
}
