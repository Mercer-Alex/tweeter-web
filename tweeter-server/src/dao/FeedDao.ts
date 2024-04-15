import { Status } from "tweeter-shared";
import { StatusDaoInterface } from "./DaoInterface";
import {
	GetCommand,
	PutCommand,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import BaseDao from "./BaseDao";

export default class FeedDao extends BaseDao implements StatusDaoInterface {
	readonly tableName = "feed2";

	readonly author_handleAttr: string = "author_handle";
	readonly postAttr = "post";
	readonly time_stampAttr = "time_stamp";
	readonly follower_handleAttr: string = "follower_handle";

	async getPageofStatuses(username: string, pageSize: number, lastItem: Status | null): Promise<[any[], boolean]> {
		const params = {
			TableName: this.tableName,
			KeyConditionExpression: this.follower_handleAttr + ' = :follower_handle',
			ExpressionAttributeValues: {
				':follower_handle': username,
			},
			Limit: pageSize,
			ScanIndexForward: false,
			ExclusiveStartKey:
				lastItem
					? { [this.follower_handleAttr]: username, [this.time_stampAttr]: lastItem.timestamp }
					: undefined,
		}
		console.log('last item', lastItem);
		console.log('feed params', params);
		let items: any[] = [];
		const data = await this.client.send(new QueryCommand(params));
		console.log('get page feed', data);

		const hasMorePages = data.LastEvaluatedKey !== undefined;
		items = data.Items!;


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

	async putStatus(status: Status, authorUserName: string, followerUserName?: string): Promise<void> {
		let time = status._timestamp;

		const params = {
			TableName: this.tableName,
			Item: {
				[this.postAttr]: status.post,
				[this.time_stampAttr]: time,
				[this.author_handleAttr]: authorUserName,
				[this.follower_handleAttr]: followerUserName,
			},
		};
		await this.client.send(new PutCommand(params));
	}
}
