import { Status } from "tweeter-shared";
import { StatusDaoInterface } from "./DaoInterface";
import {
	GetCommand,
	PutCommand,
	QueryCommand,
	BatchWriteCommand,
	BatchWriteCommandInput,
	BatchWriteCommandOutput
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
		console.log("dao status", status)

		const params = {
			TableName: this.tableName,
			Item: {
				[this.postAttr]: status._post,
				[this.time_stampAttr]: time,
				[this.author_handleAttr]: authorUserName,
				[this.follower_handleAttr]: followerUserName,
			},
		};
		await this.client.send(new PutCommand(params));
	}

	async putBatchFeedItems(newStatus: Status, usernames: string[]): Promise<void> {
		if (usernames.length == 0) {
			console.log('zero users to batch write to');
			return;
		}
		else {
			const params = {
				RequestItems: {
					[this.tableName]: this.createPutBatchFeedItems(newStatus, usernames)
				}
			}
			await this.client.send(new BatchWriteCommand(params))
				.then(async (resp) => {
					await this.putUnprocessedItems(resp, params, 0);
					return;
				})
				.catch(err => {
					throw new Error('Error while batchwriting feeds to users with params: ' + params + ": \n" + err);
				});
		}
	}
	private createPutBatchFeedItems(newStatus: Status, usernames: string[]): any[] {
		let userList = usernames.map(username => this.createPutStatusRequest(newStatus, username));

		return userList;
	}
	private createPutStatusRequest(newStatus: Status, followeeAlias: string) {
		let item = {
			[this.postAttr]: newStatus.post,
			[this.time_stampAttr]: newStatus._timestamp,
			[this.author_handleAttr]: newStatus.user._alias,
			[this.follower_handleAttr]: followeeAlias,
		}
		let request = {
			PutRequest: {
				Item: item
			}
		}
		return request;
	}
	private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput, attempts: number) {
		if (attempts > 1) console.log(attempts + 'th attempt starting');
		; if (resp.UnprocessedItems != undefined) {
			let sec = 0.03;
			if (Object.keys(resp.UnprocessedItems).length > 0) {
				console.log(Object.keys(resp.UnprocessedItems[this.tableName]).length + ' unprocessed items');
				//The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
				// @ts-ignore 
				params.RequestItems = resp.UnprocessedItems;
				// execSync('sleep ' + sec);
				if (sec < 10) sec += 0.1;
				await this.client.send(new BatchWriteCommand(params))
					.then(async (innerResp) => {
						if (innerResp.UnprocessedItems != undefined && Object.keys(innerResp.UnprocessedItems).length > 0) {
							params.RequestItems = innerResp.UnprocessedItems;
							++attempts
							await this.putUnprocessedItems(innerResp, params, attempts)
						}
					}).catch(err => {
						console.log('error while batch writing unprocessed items ' + err);
					});

			}
		}
	}
}
