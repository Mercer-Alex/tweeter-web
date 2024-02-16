import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
    setDisplayedUser: (user: User) => void;
    displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
    private service: UserService;
    private view: UserNavigationView;

    public constructor(view: UserNavigationView) {
        this.service = new UserService();
        this.view = view;
    } 
    public async navigateToUser(currentUser: User, target: string, authToken: AuthToken) {
        try {
          let alias = extractAlias(target.toString());
    
          let user = await this.service.getUser(authToken!, alias);
    
          if (!!user) {
            if (currentUser!.equals(user)) {
              this.view.setDisplayedUser(currentUser!);
            } else {
              this.view.setDisplayedUser(user);
            }
          }
        } catch (error) {
          this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    }
}

function extractAlias(value: string): string {
    let index = value.indexOf("@");
    return value.substring(index);
}
