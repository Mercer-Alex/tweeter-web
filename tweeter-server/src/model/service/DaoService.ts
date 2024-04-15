import AuthDao from "../../dao/AuthDao";
import { DaoFactory } from "../../dao/DaoFactory";
import UserDao from "../../dao/UserDao";
import AuthTokenDao from "../../dao/AuthTokenDao";
import S3Dao from "../../dao/S3Dao";
import FollowDao from "../../dao/FollowDao";
import StoryDao from "../../dao/StoryDao";
import FeedDao from "../../dao/FeedDao";
import { AuthToken } from "tweeter-shared";

export class DaoService {
	private _dao: DaoFactory | null = null;
	private _authDao: AuthDao;
	private _userDao: UserDao;
	private _authTokenDao: AuthTokenDao;
	private _s3Dao: S3Dao;
	private _followDao: FollowDao;
	private _storyDao: StoryDao;
	private _feedDao: FeedDao;

	constructor() {
		this._authDao = this.dao?.getAuthDao();
		this._userDao = this.dao?.getUserDao();
		this._authTokenDao = this.dao?.getAuthTokenDao();
		this._s3Dao = this.dao?.getS3Dao();
		this._followDao = this.dao?.getFollowDao();
		this._storyDao = this.dao?.getStoryDao();
		this._feedDao = this.dao?.getFeedDao();
	}

	get dao(): DaoFactory {
		if (this._dao == null) {
			this._dao = new DaoFactory();
		}
		return this._dao
	}

	get authDao(): AuthDao {
		return this._authDao;
	}

	get userDao(): UserDao {
		return this._userDao;
	}

	get authTokenDao(): AuthTokenDao {
		return this._authTokenDao;
	}

	get s3Dao(): S3Dao {
		return this._s3Dao;
	}

	get followDao(): FollowDao {
		return this._followDao;
	}

	get feedDao(): FeedDao {
		return this._feedDao;
	}

	get storyDao(): StoryDao {
		return this._storyDao;
	}

	public async checkAuthToken(authToken: AuthToken): Promise<[AuthToken, string]> {
		console.log('checking token', authToken);
		const response: [AuthToken, string] | [undefined, undefined] = await this.authTokenDao.checkAuthToken(authToken);
		console.log('response from token check', response);
		if (response[0] == undefined || response[1] == undefined) {
			throw new Error('Invalid auth token');
		}

		return [response[0], response[1]];
	}
}
