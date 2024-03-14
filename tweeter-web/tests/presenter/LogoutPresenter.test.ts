import { AuthToken } from 'tweeter-shared';
import { LogoutPresenter, LogoutView } from '../../src/presenter/LogoutPresenter';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';
import { UserService } from '../../src/model/service/UserService';

describe('LogoutPresenter', () => {
	let mockLogoutPresenter: LogoutPresenter;
	let mockLogoutView: LogoutView;
	let mockUserService: UserService;

	const authToken: AuthToken = new AuthToken('123abc', Date.now());

	beforeEach(() => {
		mockLogoutView = mock<LogoutView>();
		const mockLogoutViewInstance = instance(mockLogoutView);

		const logoutPresenterSpy = spy(new LogoutPresenter(mockLogoutViewInstance))
		mockLogoutPresenter = instance(logoutPresenterSpy)

		mockUserService = mock<UserService>();
		const mockUserServiceInstance = instance(mockUserService);

		when(logoutPresenterSpy.service).thenReturn(mockUserServiceInstance);
	});

	it('should tell the view to display a logging out message', async () => {
		await mockLogoutPresenter.logOut(authToken);
		verify(mockLogoutView.displayInfoMessage('Logging Out...', 0))
	});
	it('should call logout on the user service with the correct auth token', async () => {
		await mockLogoutPresenter.logOut(authToken);
		verify(mockUserService.logout(anything())).once();

	});
	it('should tell the view to clear the last info message, clear the user info, and navigate to the login page on successful logout', async () => {
		await mockLogoutPresenter.logOut(authToken);

		verify(mockLogoutView.clearLastInfoMessage()).once();
		verify(mockLogoutView.clearUserInfo()).once();
		verify(mockLogoutView.displayErrorMessage(anything())).never();
	});
	it('should tell the view to display an error message and should not: clear the last info message, clear the user info, and navigate to the login page', async () => {
		const error = new Error('An error occurred');
		when(mockUserService.logout(authToken)).thenThrow(error);

		await mockLogoutPresenter.logOut(authToken);

		verify(mockLogoutView.displayErrorMessage('Failed to log user out because of exception: Error: An error occurred')).once();
		verify(mockLogoutView.clearLastInfoMessage()).never();
		verify(mockLogoutView.clearUserInfo()).never();
	});
});
