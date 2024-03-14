import { AuthToken, Status, User } from 'tweeter-shared';
import { PostStatusPresenter, PostStatusView } from '../../src/presenter/PostStatusPresenter';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';
import { StatusService } from '../../src/model/service/StatusService';

describe('PostStatusPresenter', () => {
	let mockPostStatusPresenter: PostStatusPresenter;
	let mockPostStatusView: PostStatusView;
	let mockStatusService: StatusService;

	const authToken: AuthToken = new AuthToken('123abc', Date.now());
	const user: User = new User('Tester', 'McTest', '@test', 'coolImage');

	beforeEach(() => {
		mockPostStatusView = mock<PostStatusView>();
		const mockPostStatusViewInstance = instance(mockPostStatusView);

		const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance))
		mockPostStatusPresenter = instance(postStatusPresenterSpy)

		mockStatusService = mock<StatusService>();
		const mockStatusServiceInstance = instance(mockStatusService);

		when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance);
	});

	it('should tell the view to display a posting status message', async () => {
		await mockPostStatusPresenter.submitPost('hello world', user, authToken);
		verify(mockPostStatusView.displayInfoMessage('Status Posted', 0))
	});
	it('should call postStatus on the post status service with the correct status string and auth token', async () => {
		await mockPostStatusPresenter.submitPost('hello world', user, authToken);
		verify(mockStatusService.postStatus(anything(), anything())).once();

		const [token, status] = capture(mockStatusService.postStatus).last();
		expect(token).toEqual(authToken);
		expect(status.post).toEqual('hello world');
	});
	it('should tell the view to clear the last info message, clear the post, and display a status posted message on success', async () => {
		await mockPostStatusPresenter.submitPost('hello world', user, authToken);

		verify(mockPostStatusView.clearLastInfoMessage()).once();
		verify(mockPostStatusView.setPost('')).once();
		verify(mockPostStatusView.displayErrorMessage(anything())).never();
	});
	it('should tell the view to display an error message and should not: clear the last info message, clear the user info, and navigate to the login page', async () => {
		const error = new Error('An error occurred');
		when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

		await mockPostStatusPresenter.submitPost('hello world', user, authToken);

		verify(mockPostStatusView.displayErrorMessage('Failed to post the status because of exception: Error: An error occurred')).once();

		verify(mockPostStatusView.clearLastInfoMessage()).never();
		verify(mockPostStatusView.setPost('')).never();
		verify(mockPostStatusView.displayInfoMessage('Status Posted!', 2000)).never();
	});
});
