import AuthDao from "./AuthDao";
import AuthTokenDao from "./AuthTokenDao";
import { DaoFactoryInterface } from "./DaoFactoryInterface";
import FollowDao from "./FollowDao";
import UserDao from "./UserDao";

export class DaoFactory implements DaoFactoryInterface {
	getAuthTokenDao(): AuthTokenDao {
		return new AuthTokenDao();
	}
	getUserDao(): UserDao {
		return new UserDao();
	}
	getFollowDao(): FollowDao {
		return new FollowDao();
	}
	getAuthDao(): AuthDao {
		return new AuthDao();
	}
}
