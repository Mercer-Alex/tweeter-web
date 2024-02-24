import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowingPresenter extends UserItemPresenter {
  protected getItemDescription(): string {
    return "load following items";
  }
  protected getMoreItems(authToken: AuthToken, displayedUser: User): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees(authToken, displayedUser, PAGE_SIZE, this.lastItem);
  }
}
