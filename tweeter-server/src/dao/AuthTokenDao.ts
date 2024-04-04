import { AuthToken } from "tweeter-shared";
import { AuthTokenDaoInterface } from "./DaoInterface";
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export default class AuthTokenDao implements AuthTokenDaoInterface {
	readonly tableName = "authToken";
	readonly auth_tokenAttr = "auth_token";
	readonly time_stampAttr = "time_stamp";
	readonly usernameAttr = "username";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


	async putAuthToken(token: AuthToken, username: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.auth_tokenAttr]: token.token,
				[this.time_stampAttr]: token.timestamp,
				[this.usernameAttr]: username,
			},
		};

		await this.client.send(new PutCommand(params));
	}

	async deleteAuthToken(token: AuthToken): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: { [this.auth_tokenAttr]: token.token },
		};

		await this.client.send(new DeleteCommand(params));
	}

	async checkAuthToken(token: AuthToken): Promise<[AuthToken, string] | [undefined, undefined]> {
		const params = {
			TableName: this.tableName,
			Key: { [this.auth_tokenAttr]: token.token },
		};

		const output = await this.client.send(new GetCommand(params));

		if (output.Item === undefined) {
			return [undefined, undefined];
		}

		const curr_time = Date.now();
		const minutesElapsed = (curr_time - output.Item!.timestamp) / 60000;
		// console.log(minutesElapsed);
		token.timestamp = curr_time;

		if (minutesElapsed < 60) {
			this.putAuthToken(token, output.Item.username);
			return [token, output.Item.username];
		} else {
			this.deleteAuthToken(token);
			return [undefined, undefined];
		}
	}
}
