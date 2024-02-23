import { User, AuthToken } from "tweeter-shared";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
    navigate: () => NavigateFunction;
    authenticate: (user: User, authtoken: AuthToken) => void;
    doLogin: () => void,
}

export class LoginPresenter extends Presenter {
    private service: UserService;

    public constructor(view: LoginView) {
        super(view);
        this.service = new UserService();
    }
    
    protected get view(): LoginView {
      return super.view as LoginView;
    }

    public navigate = useNavigate();
    
    public async doLogin(alias: string, password: string, originalUrl: string): Promise<void> {
      this.doFailureRecordingOperation(async () => {
          let [user, authToken] = await this.service.login(alias, password);
    
          this.view.authenticate(user, authToken);
    
          if (!!originalUrl) {
            this.navigate(originalUrl);
          } else {
            this.navigate("/");
          }
      },
      "log user in");
    };
}
