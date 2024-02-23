import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FollowersPresenter extends UserItemPresenter {
    private service: FollowService;

    public constructor(view: UserItemView) {
        super(view);
        this.service = new FollowService();
    }

    protected get view(): UserItemView {
      return super.view as UserItemView;
    }

    public async loadMoreItems(authToken: AuthToken, displayedUser: User) {
      this.doFailureRecordingOperation(async () => {
        if (this.hasMoreItems) {
          let [newItems, hasMore] = await this.service.loadMoreFollowers(authToken, displayedUser, PAGE_SIZE, this.lastItem);
  
          this.hasMoreItems = hasMore;
          this.lastItem = newItems[newItems.length - 1]
          this.view.addItems(newItems);
        }
      },
      "load followers");
      };
}
