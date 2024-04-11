import { AuthTokenDaoInterface } from "./DaoInterface";
import {
	DeleteCommand,
	GetCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthToken } from "tweeter-shared";
import BaseDao from "./BaseDao";

export default class AuthTokenDao extends BaseDao implements AuthTokenDaoInterface {
	readonly tableName = "authToken";
	readonly auth_tokenAttr = "auth_token";
	readonly time_stampAttr = "time_stamp";
	readonly usernameAttr = "username";

	async putAuthToken(authToken: AuthToken, username: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.auth_tokenAttr]: authToken.token,
				[this.time_stampAttr]: authToken.timestamp,
				[this.usernameAttr]: username,
			},
		};

		await this.client.send(new PutCommand(params));
	}

	async deleteAuthToken(authToken: AuthToken): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: { [this.auth_tokenAttr]: authToken._token },
		};
		console.log("deleteAuth", params);

		await this.client.send(new DeleteCommand(params));
	}

	async checkAuthToken(authToken: AuthToken): Promise<[AuthToken, string] | [undefined, undefined]> {
		const params = {
			TableName: this.tableName,
			Key: { [this.auth_tokenAttr]: authToken._token },
		};

		const output = await this.client.send(new GetCommand(params));

		if (output.Item === undefined) {
			return [undefined, undefined];
		}

		const curr_time = Date.now();
		const minutesElapsed = (curr_time - output.Item!.timestamp) / 60000;
		// console.log(minutesElapsed);
		authToken.timestamp = curr_time;

		if (minutesElapsed < 60) {
			this.putAuthToken(authToken, output.Item.username);
			return [authToken, output.Item.username];
		} else {
			this.deleteAuthToken(authToken);
			return [undefined, undefined];
		}
	}
}
