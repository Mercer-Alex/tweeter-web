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

  public async doAuthentication(alias: string, password: string): Promise<[User, AuthToken]> {
    return this.service.login(alias, password);
  }
}
