import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowersPresenter extends UserItemPresenter {
  public constructor(view: UserItemView) {
    super(view);
  }

  protected get view(): UserItemView {
    return super.view as UserItemView;
  }

  protected getItemDescription(): string {
    return "load followers";
  }
  protected getMoreItems(authToken: AuthToken, displayedUser: User): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers(authToken, displayedUser, PAGE_SIZE, this.lastItem);
  }
}
