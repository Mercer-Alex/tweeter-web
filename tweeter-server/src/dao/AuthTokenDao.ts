import { AuthTokenDaoInterface } from "./DaoInterface";
import {
	DeleteCommand,
	GetCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthToken } from "tweeter-shared";
import BaseDao from "./BaseDao";

export default class AuthTokenDao extends BaseDao implements AuthTokenDaoInterface {
	readonly tableName = "authToken2";
	readonly auth_tokenAttr = "token";
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
		console.log('the params', params);
		let resp = await this.client.send(new PutCommand(params));
		console.log("db response", resp);
	}

	async deleteAuthToken(authToken: AuthToken): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.auth_tokenAttr]: authToken.token,
				[this.time_stampAttr]: authToken.timestamp,
			},
		};
		console.log('deleting auth token', params);

		await this.client.send(new DeleteCommand(params));
	}

	async checkAuthToken(authToken: AuthToken): Promise<[AuthToken, string] | [undefined, undefined]> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.auth_tokenAttr]: authToken.token,
				[this.time_stampAttr]: authToken.timestamp,
			},
		};
		console.log('auth token params', params);

		const output = await this.client.send(new GetCommand(params));
		console.log('auth token output', output);
		if (output.Item === undefined) {
			return [undefined, undefined];
		}

		const curr_time = Date.now();
		const minutesElapsed = (curr_time - output.Item!.time_stamp) / 60000;
		console.log(minutesElapsed);
		authToken.timestamp = curr_time;

		if (minutesElapsed < 60) {
			console.log('return authtoken');
			return [authToken, output.Item.username];
		} else {
			this.deleteAuthToken(authToken);
			return [undefined, undefined];
		}
	}
}
