import { AuthToken, User } from 'tweeter-shared'
import { StatusService } from '../../src/model/service/StatusService'
import 'isomorphic-fetch'

describe('StatusService', () => {
	it('should successfully return a user\'s story pages', async () => {
		const statusService = new StatusService();
		const user = new User('firstName', 'lastName', 'alias', 'imageStringBase64');
		const authToken = new AuthToken('token', Date.now());
		const lastItem = null;
		const pageSize = 10;

		const result = await statusService.loadMoreStoryItems(authToken, user, pageSize, lastItem);

		expect(result).not.toBeNull();
		expect(result.length).toBe(2);

		const [storyItems, hasMoreItems] = result;

		expect(storyItems.length).toBe(pageSize);
		expect(hasMoreItems).toBe(true);
	});
});
