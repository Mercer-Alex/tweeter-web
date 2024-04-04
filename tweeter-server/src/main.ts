import { Follow, User } from "tweeter-shared";
import FollowDao from "./dao/FollowDao";
import { DaoFactory } from "./dao/DaoFactory";


console.log('running main');
class Main {

	async run() {
		const daoFactory = new DaoFactory()


		console.log('async run');
		const followDao: FollowDao = daoFactory.getFollowDao();

		const follower = new User("Alex", "Mercer", "@alex", "image/url");


		// for (let i = 0; i < 25; i++) {
		// 	const followee = new User("First_" + i, "Last_" + i, "@alias_" + i, "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
		// 	await followDao.putFollow(new Follow(follower, followee));
		// }

		const followeeToCheck = new User("First_1", "Last_1", "@alias_1", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");

		const isFollowing: boolean | undefined = await followDao.getFollow(new Follow(follower, followeeToCheck));

		if (isFollowing != null) {
			console.log(isFollowing);
		}

		// for (let i = 0; i < 25; i++) {
		// 	const followee = new User("First_" + i, "Last_" + i, "@alias_" + i, "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");
		// 	await followDao.putFollow(new Follow(followee, follower));
		// }

		// await dao.deleteFollow(new Follow(follower, followeeToCheck));


		// const page1 = await followDao.getPageOfFollowers("@test0", 10, "@a")
		// const page2 = await dao.getPageOfFollowees("@a", 5, "@test24");
		// console.log(page1[1]);
		// console.log(page2.values);

		const userDao = daoFactory.getUserDao()

		// for (let i = 0; i < 25; i++) {
		// 	const user = new User("First_" + i, "Last_" + i, "@alias_" + i, "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png");

		// 	await userDao.putUser(user);
		// }

		const authDao = daoFactory.getAuthDao();

		// for (let i = 0; i < 25; i++) {
		// 	await authDao.putAuthentication("@alias_" + i, "password_" + i);
		// }

		await authDao.putAuthentication("@alex", "password");
	}
}

const mainInstance = new Main();
mainInstance.run().catch(error => {
	console.error('An unhandled error occurred:', error);
});
