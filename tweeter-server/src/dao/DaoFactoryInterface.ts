import AuthDao from "./AuthDao";
import AuthTokenDao from "./AuthTokenDao";
import FeedDao from "./FeedDao";
import FollowDao from "./FollowDao";
import S3Dao from "./S3Dao";
import StoryDao from "./StoryDao";
import UserDao from "./UserDao";

export interface DaoFactoryInterface {
	getUserDao(): UserDao;
	getFollowDao(): FollowDao;
	getAuthDao(): AuthDao;
	getAuthTokenDao(): AuthTokenDao;
	getS3Dao(): S3Dao;
	getStoryDao(): StoryDao;
	getFeedDao(): FeedDao;
}
