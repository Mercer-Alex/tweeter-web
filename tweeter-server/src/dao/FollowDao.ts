import { Follow, User } from "tweeter-shared";
import { FollowDaoInterface } from "./DaoInterface";
import {
	DeleteCommand,
	GetCommand,
	PutCommand,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import BaseDao from "./BaseDao";

export default class FollowDao extends BaseDao implements FollowDaoInterface {
	readonly tableName: string = "follows";
	readonly indexName: string = "follows_index";
	readonly followee_handleAttr: string = "followee_handle";
	readonly followee_nameAttr: string = "followee_name";
	readonly follower_handleAttr: string = "follower_handle";
	readonly follower_nameAttr: string = "follower_name";


	async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[string[], boolean]> {
		const params = {
			TableName: this.tableName,
			IndexName: "follows_index",
			KeyConditionExpression: 'followee_handle = :followee_handle',
			ExpressionAttributeValues: {
				':followee_handle': followerHandle,
			},
			Limit: pageSize,
			ExclusiveStartKey:
				lastFolloweeHandle
					? { [this.follower_handleAttr]: followerHandle, [this.followee_handleAttr]: lastFolloweeHandle }
					: undefined,
		};

		const items: string[] = [];
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;

		console.log('followees data', data.Items);

		data.Items?.forEach((item) =>
			items.push(item[this.follower_handleAttr])!
		);
		return [items, hasMorePages]
	}

	async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[string[], boolean]> {
		const params = {
			TableName: this.tableName,
			IndexName: "follows_index",
			KeyConditionExpression: this.followee_handleAttr + ' = :followee_handle',
			ExpressionAttributeValues: {
				':followee_handle': followeeHandle,
			},
			Limit: pageSize,
			ExclusiveStartKey:
				lastFollowerHandle
					? { [this.followee_handleAttr]: followeeHandle, [this.follower_handleAttr]: lastFollowerHandle }
					: undefined,
		};
		console.log('last follower', lastFollowerHandle);
		const data = await this.client.send(new QueryCommand(params));
		const items: string[] = [];
		const hasMorePages = data.LastEvaluatedKey !== undefined;

		data.Items?.forEach((item) =>
			items.push(item[this.follower_handleAttr])!
		);

		return [items, hasMorePages];
	}

	async getFollowers(followerHandle: string): Promise<string[]> {
		const params = {
			TableName: this.tableName,
			IndexName: "follows_index",
			KeyConditionExpression: 'followee_handle = :followee_handle',
			ExpressionAttributeValues: {
				':followee_handle': followerHandle,
			},
		};

		const items: string[] = [];
		const data = await this.client.send(new QueryCommand(params));

		console.log('followers aliases?', data.Items);

		data.Items?.forEach((item) =>
			items.push(item[this.follower_handleAttr])!
		);

		return items;

	}

	async putFollow(follows: Follow): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.follower_handleAttr]: follows.follower.alias,
				[this.follower_nameAttr]: follows.follower.name,
				[this.followee_nameAttr]: follows.followee.name,
				[this.followee_handleAttr]: follows.followee.alias,
			},
		};
		await this.client.send(new PutCommand(params));
	}

	public async updateFollow(follow: Follow): Promise<void> {
		this.putFollow(follow);
	}

	async getFollow(follows: Follow): Promise<boolean> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.followee_handleAttr]: follows.followee.alias,
				[this.follower_handleAttr]: follows.follower.alias,
			},
		};
		const output = await this.client.send(new GetCommand(params));

		return output.Item == undefined ? false : true;
	}

	async deleteFollow(follows: Follow): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.followee_handleAttr]: follows.followee.alias,
				[this.follower_handleAttr]: follows.follower.alias,
			},
		};
		await this.client.send(new DeleteCommand(params));
	}
}
