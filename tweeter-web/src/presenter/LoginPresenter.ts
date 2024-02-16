import { User, AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";
import { NavigateFunction, To, useNavigate } from "react-router-dom";

export interface LoginView {
    displayErrorMessage: (message: string) => void;
    navigate: () => NavigateFunction;
    authenticate: (user: User, authtoken: AuthToken) => void;
    doLogin: () => void,
}

export class LoginPresenter {
    private view: LoginView;
    private service: LoginService;

    public constructor(view: LoginView) {
        this.view = view;
        this.service = new LoginService();
    }

    public navigate = useNavigate();
    
    public async doLogin(alias: string, password: string, originalUrl: string): Promise<void> {
        try {
          let [user, authToken] = await this.service.login(alias, password);
    
          this.view.authenticate(user, authToken);
    
          if (!!originalUrl) {
            this.navigate(originalUrl);
          } else {
            this.navigate("/");
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        }
    }
}
