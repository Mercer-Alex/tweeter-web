import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from "react-router-dom";
import Login from '../../../src/components/authentication/login/Login';
import React from 'react';
import '@testing-library/jest-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { LoginPresenter } from '../../../src/presenter/LoginPresenter';
import { anything, instance, mock, verify } from 'ts-mockito';
import { AuthView } from '../../../src/presenter/AuthPresenter';


library.add(fab);

describe('Login Component', () => {
	it('should render the sign-in button as disabled', () => {
		const { signInButton } = renderLoginAndGetElements('/');
		expect(signInButton).toBeDisabled();
	});

	it('should enable sign-in when both the alias and password fields have text', async () => {
		const { signInButton, aliasField, passwordField, user } =
			renderLoginAndGetElements('/');

		await user.type(aliasField, '@alias');
		await user.type(passwordField, 'password');

		expect(signInButton).toBeEnabled();
	});

	it('should disable sign-in button if either fields is cleared', async () => {
		const { signInButton, aliasField, passwordField, user } =
			renderLoginAndGetElements('/');

		await user.type(aliasField, '@alias');
		await user.type(passwordField, 'password');
		expect(signInButton).toBeEnabled();

		await user.clear(aliasField);
		expect(signInButton).toBeDisabled();

		await user.type(aliasField, '@alias');
		expect(signInButton).toBeEnabled();

		await user.clear(passwordField);
		expect(signInButton).toBeDisabled();
	});

	it('should call the presenter\'s login method with the correct parameters when the login button is pressed', async () => {
		const mockLoginPresenter = mock<LoginPresenter>();
		const mockPresenterInstance = instance(mockLoginPresenter);

		const alias = '@alias';
		const password = 'password';

		const { signInButton, aliasField, passwordField, user } =
			renderLoginAndGetElements('/', mockPresenterInstance);

		await user.type(aliasField, alias);
		await user.type(passwordField, password);
		await user.click(signInButton);

		verify(mockLoginPresenter.doAuthentication(alias, password)).never();
	});
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
	return render(
		<MemoryRouter>
			{
				!!presenter
					? <Login originalUrl={originalUrl} presenterGenerator={(view: AuthView) =>
						new LoginPresenter(view)
					} presenter={presenter} />
					: <Login originalUrl={originalUrl} presenterGenerator={(view: AuthView): LoginPresenter =>
						new LoginPresenter(view)
					} />
			}
		</MemoryRouter>
	)
};

const renderLoginAndGetElements = (orginalUrl: string, presenter?: LoginPresenter) => {
	const user = userEvent.setup();
	renderLogin(orginalUrl, presenter);

	const signInButton = screen.getByRole('button', { name: /Sign in/i });
	const aliasField = screen.getByLabelText('alias');
	const passwordField = screen.getByLabelText('password');

	return { signInButton, aliasField, passwordField, user };
};
