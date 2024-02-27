import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";


export class LoginPresenter extends AuthPresenter {
  protected get view(): AuthView {
    return super.view as AuthView;
  }

  protected createService(): UserService {
    return new UserService();
  }

  protected getItemDescription(): string {
    return "log user in";
  }

  protected doAuthentication(alias: string, password: string, firstName?: string | undefined, lastName?: string | undefined, imageBytes?: Uint8Array | undefined): Promise<[User, AuthToken]> {
    return this.service.login(alias, password);
  }
}
