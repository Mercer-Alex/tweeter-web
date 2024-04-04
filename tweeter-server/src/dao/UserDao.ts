import { User } from "tweeter-shared";
import { UserDaoInterface } from "./DaoInterface";
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export default class UserDao implements UserDaoInterface {
	readonly tableName = "users";
	readonly usernameAttr = "username";
	readonly first_nameAttr = "first_name";
	readonly last_nameAttr = "last_name";
	readonly image_urlAttr = "image_url";
	readonly followersAttr = "followers";
	readonly followeesAttr = "followees";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	async updateFollowersCount(username: string, value: number): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: { [this.usernameAttr]: username },
			UpdateExpression:
				"set " + this.followersAttr + " = " + this.followersAttr + " + :inc",
			ExpressionAttributeValues: {
				":inc": value,
			},
		};

		await this.client.send(new UpdateCommand(params));
	}

	async updateFolloweesCount(username: string, value: number): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: { [this.usernameAttr]: username },
			UpdateExpression:
				"set " + this.followeesAttr + " = " + this.followeesAttr + " + :inc",
			ExpressionAttributeValues: {
				":inc": value,
			},
		};

		await this.client.send(new UpdateCommand(params));
	}

	async getFollowersCount(username: string): Promise<number> {
		const params = {
			TableName: this.tableName,
			Key: { [this.usernameAttr]: username },
		};

		const output = await this.client.send(new GetCommand(params));

		return output.Item?.followers;
	}

	async getFolloweesCount(username: string): Promise<number> {
		const params = {
			TableName: this.tableName,
			Key: { [this.usernameAttr]: username },
		};

		const output = await this.client.send(new GetCommand(params));

		return output.Item?.followees;
	}

	async getUser(username: string): Promise<User | undefined> {
		const params = {
			TableName: this.tableName,
			Key: { [this.usernameAttr]: username },
		};

		const output = await this.client.send(new GetCommand(params));
		return output.Item == undefined
			? undefined
			: new User(
				output.Item.first_name,
				output.Item.last_name,
				output.Item.alias,
				output.Item.image_url
			);
	}

	async putUser(user: User): Promise<boolean> {
		if ((await this.getUser(user.alias)) !== undefined) {
			return false;
		}

		const params = {
			TableName: this.tableName,
			Item: {
				[this.usernameAttr]: user.alias,
				[this.first_nameAttr]: user.firstName,
				[this.last_nameAttr]: user.lastName,
				[this.image_urlAttr]: user.imageUrl,
				[this.followersAttr]: 0,
				[this.followeesAttr]: 0,
			},
		};
		await this.client.send(new PutCommand(params));

		return true;
	}

	async deleteUser(username: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: { [this.usernameAttr]: username },
		};

		await this.client.send(new DeleteCommand(params));
	}
}
