import { AuthDaoInterface } from "./DaoInterface";
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import * as CryptoJS from 'crypto-js';


export default class AuthDao implements AuthDaoInterface {
	readonly tableName = "auth";
	readonly usernameAttr = "username";
	readonly passwordAttr = "password";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


	async putAuthentication(username: string, password: string): Promise<void> {
		let hash = CryptoJS.SHA256(password);
		let hashString = hash.toString(CryptoJS.enc.Hex);
		const params = {
			TableName: this.tableName,
			Item: {
				[this.usernameAttr]: username,
				[this.passwordAttr]: hashString,
			},
		};

		await this.client.send(new PutCommand(params));
	}

	async deleteAuthentication(username: string) {
		const params = {
			TableName: this.tableName,
			Key: { [this.usernameAttr]: username },
		};

		await this.client.send(new DeleteCommand(params));
	}

	async authenticate(username: string, password: string): Promise<boolean> {
		const params = {
			TableName: this.tableName,
			Key: { [this.usernameAttr]: username },
		};
		const output = await this.client.send(new GetCommand(params));
		if (output === undefined) {
			return false;
		}

		let hash = CryptoJS.SHA256(password);
		let hashString = hash.toString(CryptoJS.enc.Hex);

		if (output.Item!.password) {
			return true;
		} else {
			return false;
		}
	}
}
