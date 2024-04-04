import { Follow } from "tweeter-shared";
import { FollowDaoInterface } from "./DaoInterface";
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand,
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


	getPageOfFollowers(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[string[], boolean]> {
		throw new Error("Method not implemented.");
	}
	getPageOfFollowees(followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined): Promise<[string[], boolean]> {
		throw new Error("Method not implemented.");
	}
	putFollow(follow: Follow): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getFollow(follows: Follow): Promise<boolean> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.followee_handleAttr]: follows.followee_handle,
				[this.follower_handleAttr]: follows.follower_handle,
			},
		};
		const output = await this.client.send(new GetCommand(params));

		return output.Item == undefined
			? undefined
			: new Follows(
				output.Item[this.follower_handleAttr],
				output.Item[this.follower_nameAttr],
				output.Item[this.followee_nameAttr],
				output.Item[this.followee_handleAttr],
			);
	}
	deleteFollow(follow: Follow): Promise<void> {
		throw new Error("Method not implemented.");
	}

}