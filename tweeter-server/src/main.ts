import FollowDao from "./dao/FollowDao";
import { DaoFactory } from "./dao/DaoFactory";
import { UserService } from "./model/service/UserService";
import { User, Follow, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "./model/service/StatusService";
import { FollowService } from "./model/service/FollowService";
import StoryDao from "./dao/StoryDao";
import FeedDao from "./dao/FeedDao";
import { imageString } from "./imageString";
import UserDao from "./dao/UserDao";

class Main {

	async run() {
		const image = imageString;

		const daoFactory = new DaoFactory()
		const followDao: FollowDao = daoFactory.getFollowDao();
		const storyDao: StoryDao = daoFactory.getStoryDao();
		const feedDao: FeedDao = daoFactory.getFeedDao();
		const authDao = daoFactory.getAuthDao();
		const userDao = daoFactory.getUserDao();


		const userService = new UserService();
		const feedService = new StatusService();
		const followService = new FollowService();

		const follower = new User("Alex", "Mercer", "@alex", image);
		const followeeToCheck = new User("First_1", "Last_1", "@alias_1", image);
		const bagless = new User("No", "Bag", "@noBag", "https://alex-cs340.s3.us-east-1.amazonaws.com/image/@noBag");

		await authDao.putAuthentication("@alex", "password");

		/* Register Users */
		// for (let i = 0; i < 25; i++) {
		// 	await userService.register("@username" + i, "password" + i, "First" + i, "Last" + i, imageString);
		// }

		/*Post stories */
		// for (let i = 0; i < 25; i++) {
		// 	const user = new User("First" + i, "Last" + i, "@username" + i, image);
		// 	const status = new Status("hello, world I'm " + "@username" + i, user, Date.now())
		// 	await storyDao.putStatus(status);
		// }

		/*Post feed */
		// for (let i = 0; i < 25; i++) {
		// 	const user = new User("First" + i, "Last" + i, "@username" + i, image);
		// 	const status = new Status("hello, there, I'm " + "@username" + i, user, Date.now())
		// 	await feedDao.putStatus(status);
		// }

		/* Put followers */
		// for (let i = 0; i < 25; i++) {
		// 	const followee = new User("First" + i, "Last" + i, "@username" + i, imageString);
		// 	await followDao.putFollow(new Follow(follower, followee));
		// }

		/* Put follows */
		// for (let i = 0; i < 25; i++) {
		// 	const followee = new User("First" + i, "Last" + i, "@username" + i, imageString);
		// 	await followDao.putFollow(new Follow(followee, follower));
		// }

		// await userDao.putUser(follower, "password");

		/* Put auth */
		// for (let i = 0; i < 25; i++) {
		// 	await authDao.putAuthentication("@username" + i, "password" + i);
		// }

		// await followDao.putFollow(new Follow(bagless, follower));



		/* Get followers and followees */
		const pageFollowers = await followDao.getPageOfFollowers("@alex", 5, undefined)
		const pageFollowees = await followDao.getPageOfFollowees("@alex", 5, "");
		console.log('page followers...........');
		console.log(pageFollowers);
		console.log('page followees............')
		console.log(pageFollowees);

		/* Get feed and story */
		const pageStory = await storyDao.getPageofStatuses("@alex", 10, null)
		const pageFeed = await feedDao.getPageofStatuses("@alex", 5, null);
		console.log('page story...........');
		console.log(pageStory);
		console.log('page feed............')
		console.log(pageFeed);

		/* Login test */
		const login = await userService.login("@alex", "password");
		console.log("logged in");
		console.log(login);

		// const isFollowing: boolean | undefined = await followDao.getFollow(new Follow(follower, followeeToCheck));
		// https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png
		// if (isFollowing != null) {
		// 	console.log(isFollowing);
		// }



		// const userDao = await daoFactory.getUserDao()
		// // await userDao.putUser(follower, 'password');
		// const getUser = await userDao.getUser("@alex");
		// console.log(getUser);


		// for (let i = 0; i < 25; i++) {
		// 	const user = new User("First_" + i, "Last_" + i, "@alias_" + i, "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");

		// 	await userDao.putUser(user, 'password_' + i);
		// }


		// const s3Dao = daoFactory.getS3Dao();
		// await s3Dao.putImage('an image', '/Users/alexmercer/Desktop/Screenshot 2024-03-14 at 4.04.29 PM.png')

		// const didregister = await userService.register("@alex", "password", "Alex", "Mercer", imageString);
		// console.log('did register?')
		// console.log(didregister);

		// const getFeed = await followService.loadMoreUsers(AuthToken.Generate(), follower, 5, followeeToCheck, false);
		// console.log(getFeed);

		/*Logout user */
		// const logout = await userService.logout(new AuthToken("c9b7b2bf-d3ae-4a1f-b453-fc40eb9d928c", 1712852541491));
		// console.log("logged out?");
		// console.log(logout);
	}
}

const mainInstance = new Main();
mainInstance.run().catch(error => {
	console.error('An unhandled error occurred:', error);
});
