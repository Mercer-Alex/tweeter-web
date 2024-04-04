import AuthDao from "./AuthDao";
import { DaoFactoryInterface } from "./DaoFactoryInterface";
import FollowDao from "./FollowDao";
import UserDao from "./UserDao";

export class DaoFactory implements DaoFactoryInterface {
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
