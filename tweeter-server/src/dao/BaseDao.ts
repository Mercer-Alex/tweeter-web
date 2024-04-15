import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export default class BaseDao {
	protected readonly client = DynamoDBDocumentClient.from(
		new DynamoDBClient({ region: "us-east-1" },)
	);
}
