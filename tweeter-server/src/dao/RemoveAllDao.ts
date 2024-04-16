import { DynamoDB } from "aws-sdk";
const ddb = new DynamoDB.DocumentClient({ "region": "us-east-1" });

async function scanTable(tableName: string): Promise<DynamoDB.DocumentClient.ItemList> {
	const params = {
		TableName: tableName,
	};
	try {
		const data = await ddb.scan(params).promise();
		return data.Items || [];
	} catch (error) {
		console.error("Error scanning table:", error);
		throw error;
	}
}
async function deleteItems(tableName: string, items: DynamoDB.DocumentClient.ItemList) {
	const batchWriteParams: DynamoDB.DocumentClient.BatchWriteItemInput = {
		RequestItems: {
			[tableName]: [],
		},
	};
	for (const item of items) {
		const deleteRequest: DynamoDB.DocumentClient.WriteRequest = {
			DeleteRequest: {
				Key: {
					"alias": item["alias"],
					"followee_handle": item["followee_handle"],
					"follower_handle": item["follower_handle"],
					"timestamp": item["timestamp"]
				},
			},
		};
		batchWriteParams.RequestItems[tableName].push(deleteRequest);
		if (batchWriteParams.RequestItems[tableName].length === 25) {
			await ddb.batchWrite(batchWriteParams).promise();
			batchWriteParams.RequestItems[tableName] = [];
		}
	}
	if (batchWriteParams.RequestItems[tableName].length > 0) {
		await ddb.batchWrite(batchWriteParams).promise();
	}
}
async function removeAllEntries(tableName: string) {
	const items = await scanTable(tableName);
	if (items.length > 0) {
		await deleteItems(tableName, items);
	} else {
	}
}
["feed", "user", "follows"].forEach(table => removeAllEntries(table).catch((error) => console.error("Failed to remove entries:", error)));
