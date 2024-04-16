import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";
import { FollowDaoFillTable } from "./FollowDaoFillTable";
import { UserDaoFillTable } from "./UserDaoFillTable";

// Make sure to increase the write capacities for the follow table, follow index, and user table. 

let mainUsername = "@alex";
let followername = "@username0";
let password = "password0";
let imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
let firstName = "First0";
let lastName = "Last0";

let numUsers = 10000;
let batchSize = 25;
let aliasList: string[] = Array.from({ length: numUsers }, (_, i) => followername + (i + 1));
let followDaoFillTable = new FollowDaoFillTable();
let userDaoFillTable = new UserDaoFillTable();

setFollowers(0);
setUsers(0);
userDaoFillTable.increaseFollowersCount(mainUsername, numUsers);

function setFollowers(i: number) {
	if (i >= numUsers) return;
	else if (i % 1000 == 0) {
		console.log(i + ' followers');
	}
	let followList = aliasList.slice(i, i + batchSize);
	followDaoFillTable.createFollows(mainUsername, followList)
		.then(() => setFollowers(i + batchSize))
		.catch(err => console.log('error while setting followers: ' + err));
}
function setUsers(i: number) {
	if (i >= numUsers) return;
	else if (i % 1000 == 0) {
		console.log(i + ' users');
	}
	let userList = createUserList(i);
	userDaoFillTable.createUsers(userList, password)
		.then(() => setUsers(i + batchSize))
		.catch(err => console.log('error while setting users: ' + err));
}


function createUserList(i: number) {
	let users: User[] = [];
	// Ensure that we start at alias1 rather than aliaszero.
	let start = i + 1;
	let limit = start + batchSize;
	for (let j = start; j < limit; ++j) {
		let user = new User(firstName + j, lastName + j, followername + j, imageUrl);
		users.push(user);
	}
	return users;
}