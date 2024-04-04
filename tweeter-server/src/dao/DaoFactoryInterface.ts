import AuthDao from "./AuthDao";
import FollowDao from "./FollowDao";
import UserDao from "./UserDao";

export interface DaoFactoryInterface {
	getUserDAO(): UserDao;
	getFollowDAO(): FollowDao;
	getAuthenticationDAO(): AuthDao;
}
