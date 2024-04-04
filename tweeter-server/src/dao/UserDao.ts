import { User } from "tweeter-shared";
import { UserDaoInterface } from "./DaoInterface";

export default class UserDao implements UserDaoInterface {
	updateFollowersCount(alias: string, value: number): Promise<void> {
		throw new Error("Method not implemented.");
	}
	updateFolloweesCount(alias: string, value: number): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getFollowersCount(alias: string): Promise<number> {
		throw new Error("Method not implemented.");
	}
	getFolloweesCount(alias: string): Promise<number> {
		throw new Error("Method not implemented.");
	}
	getUser(alias: string): Promise<User | undefined> {
		throw new Error("Method not implemented.");
	}
	putUser(user: User): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	deleteUser(alias: string): Promise<void> {
		throw new Error("Method not implemented.");
	}

}