import { Follow } from "tweeter-shared";
import { FollowDaoInterface } from "./DaoInterface";
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export default class FollowDao implements FollowDaoInterface {
	readonly tableName: string = "follows";
	readonly indexName: string = "follows_index";
	readonly followee_handleAttr: string = "followee_handle";
	readonly followee_nameAttr: string = "followee_name";
	readonly follower_handleAttr: string = "follower_handle";
	readonly follower_nameAttr: string = "follower_name";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


	async getPageOfFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined): Promise<[string[], boolean]> {
		const params = {
			KeyConditionExpression: this.followee_handleAttr + " = :followee_handle",
			ExpressionAttributeValues: {
				":follower_handle": followerHandle,
			},
			TableName: this.tableName,
			IndexName: this.indexName,
			Limit: pageSize,
			ExclusiveStartKey:
				lastFolloweeHandle === undefined
					? undefined
					: {
						[this.follower_handleAttr]: followerHandle,
						[this.followee_handleAttr]: lastFolloweeHandle,
					},
		};

		const items: string[] = [];
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;

		data.Items?.forEach((item) =>
			items.push(item[this.followee_handleAttr])
		);

		return [items, hasMorePages]
	}
	async getPageOfFollowers(followeeHandle: string, pageSize: number, lastFolloweHandle: string | undefined): Promise<[string[], boolean]> {
		const params = {
			KeyConditionExpression: this.follower_handleAttr + " = :follower_handle",
			ExpressionAttributeValues: {
				":followee_handle": followeeHandle,
			},
			TableName: this.tableName,
			IndexName: this.indexName,
			Limit: pageSize,
			ExclusiveStartKey:
				lastFolloweHandle === undefined
					? undefined
					: {
						[this.followee_handleAttr]: lastFolloweHandle,
						[this.follower_handleAttr]: followeeHandle,
					},
		};

		const items: string[] = [];
		console.log(params);
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;
		data.Items?.forEach((item) =>
			items.push(item[this.follower_handleAttr])
		);

		return [items, hasMorePages];
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
