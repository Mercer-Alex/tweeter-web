import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView{
    setPost: (value: React.SetStateAction<string>) => void;
}
export class PostStatusPresenter extends Presenter {
    private service: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this.service = new StatusService();
    }

    protected get view(): PostStatusView {
      return super.view as PostStatusView;
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken ) {
      this.doFailureRecordingOperation(async () => {
        this.view.displayInfoMessage("Posting status...", 0);
        let status = new Status(post, currentUser!, Date.now());
  
        await this.service.postStatus(authToken!, status);
  
        this.view.clearLastInfoMessage();
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status"); 
      };

      public clearPost(event: React.MouseEvent) {
        event.preventDefault();
        this.view.setPost("");
      };

}