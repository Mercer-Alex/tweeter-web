
import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import BaseDao from "./BaseDao";
import { SHA256 } from "crypto-js";
import { User } from "tweeter-shared";
import { execSync } from "child_process";



export class UserDaoFillTable extends BaseDao {

	readonly tableName = "users";
	readonly usernameAttr = "username";
	readonly first_nameAttr = "first_name";
	readonly last_nameAttr = "last_name";
	readonly image_urlAttr = "image_url";
	readonly followersAttr = "followers";
	readonly followeesAttr = "followees";
	readonly passwordAttr = "password";

	async createUsers(userList: User[], password: string) {
		if (userList.length == 0) {
			console.log('zero followers to batch write');
			return;
		}
		else {
			const hashedPassword = SHA256(password).toString();
			const params = {
				RequestItems: {
					[this.tableName]: this.createPutUserRequestItems(userList, hashedPassword)
				}
			}
			await this.client.send(new BatchWriteCommand(params))
				.then(async (resp) => {
					await this.putUnprocessedItems(resp, params);
				})
				.catch(err => {
					throw new Error('Error while batchwriting users with params: ' + params + ": \n" + err);
				});;
		}
	}
	private createPutUserRequestItems(userList: User[], hashedPassword: string) {
		return userList.map(user => this.createPutUserRequest(user, hashedPassword));
	}

	private createPutUserRequest(user: User, hashedPassword: string) {
		let item = {
			[this.usernameAttr]: user.alias,
			[this.first_nameAttr]: user.firstName,
			[this.last_nameAttr]: user.lastName,
			[this.passwordAttr]: hashedPassword,
			[this.image_urlAttr]: user.imageUrl,
			[this.followersAttr]: 0,
			[this.followeesAttr]: 1
		}
		let request = {
			PutRequest: {
				Item: item
			}
		}
		return request;
	}

	private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput) {
		if (resp.UnprocessedItems != undefined) {
			let sec = 0.01;
			while (Object.keys(resp.UnprocessedItems).length > 0) {
				console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
				//The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
				// @ts-ignore 
				params.RequestItems = resp.UnprocessedItems;
				execSync('sleep ' + sec);
				if (sec < 1) sec += 0.1;
				await this.client.send(new BatchWriteCommand(params));
				if (resp.UnprocessedItems == undefined) {
					break;
				}
			}
		}
	}
	increaseFollowersCount(alias: string, count: number) {
		const params = {
			TableName: this.tableName,
			Key: { [this.usernameAttr]: alias },
			ExpressionAttributeValues: { ":inc": count },
			UpdateExpression: "SET " + this.followersAttr + " = " + this.followeesAttr + ' + :inc'
		};
		this.client.send(new UpdateCommand(params)).then(data => {
			return true
		});
	}
}
