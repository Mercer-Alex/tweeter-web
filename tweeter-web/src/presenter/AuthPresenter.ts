import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AuthView extends View {
	navigate: NavigateFunction;
	authenticate: (user: User, authtoken: AuthToken) => void;
}

export abstract class AuthPresenter extends Presenter {
	private _service: UserService;

	public constructor(view: AuthView) {
		super(view);
		this._service = this.createService();
	}

	protected get view(): AuthView {
		return super.view as AuthView;
	}

	protected abstract createService(): UserService;

	protected get service() {
		return this._service;
	}

	public async authenticateUser(
		alias: string,
		password: string,
		navigateUrl: string,
		firstName?: string,
		lastName?: string,
		imageBytes?: Uint8Array) {
		this.doFailureRecordingOperation(async () => {
			let [user, authToken] = await this.doAuthentication(alias, password, firstName!, lastName!, imageBytes!);

			this.view.authenticate(user, authToken);
			this.view.navigate(navigateUrl);
		},
			this.getItemDescription());
	};

	protected abstract getItemDescription(): string;

	protected abstract doAuthentication(
		alias: string,
		password: string,
		firstName?: string,
		lastName?: string,
		imageBytes?: Uint8Array
	): Promise<[User, AuthToken]>;
}
