import AuthDao from "./AuthDao";
import AuthTokenDao from "./AuthTokenDao";
import { DaoFactoryInterface } from "./DaoFactoryInterface";
import FollowDao from "./FollowDao";
import UserDao from "./UserDao";

export class DaoFactory implements DaoFactoryInterface {
	getAuthTokenDao(): AuthTokenDao {
		return new AuthTokenDao();
	}
	getUserDAO(): UserDao {
		return new UserDao();
	}
	getFollowDAO(): FollowDao {
		return new FollowDao();
	}
	getAuthenticationDAO(): AuthDao {
		return new AuthDao();
	}
}
