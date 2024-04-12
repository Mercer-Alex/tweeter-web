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
		console.log('page of statuses', username);
		const params = {
			TableName: this.tableName,
			KeyConditionExpression: 'author_handle = :author_handle',
			ExpressionAttributeValues: {
				':author_handle': username,
			},
			Limit: pageSize,
			ExclusiveStartKey: (lastStatus != null)
				? { [this.author_handleAttr]: username, [this.time_stampAttr]: lastStatus._timestamp }
				: undefined
		}

		const data = await this.client.send(new QueryCommand(params));
		const items: Status[] = data.Items as Status[];
		const hasMorePages = data.LastEvaluatedKey !== undefined;

		console.log('story data', data);

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
