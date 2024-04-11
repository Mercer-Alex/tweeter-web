import AuthDao from "./AuthDao";
import AuthTokenDao from "./AuthTokenDao";
import { DaoFactoryInterface } from "./DaoFactoryInterface";
import FeedDao from "./FeedDao";
import FollowDao from "./FollowDao";
import S3Dao from "./S3Dao";
import StoryDao from "./StoryDao";
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
	getS3Dao(): S3Dao {
		return new S3Dao();
	}
	getStoryDao(): StoryDao {
		return new StoryDao();
	}
	getFeedDao(): FeedDao {
		return new FeedDao;
	}
}
