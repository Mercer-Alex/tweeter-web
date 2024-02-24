import { PAGE_SIZE } from './PagedItemPresenter.js';
import { StatusItemPresenter, StatusItemView } from './StatusItemPresenter.js';
import { AuthToken, Status, User } from 'tweeter-shared';

export class FeedPresenter extends StatusItemPresenter {
  protected getItemDescription(): string {
    return "load feed items"
  }
  protected getMoreItems(authToken: AuthToken, displayedUser: User): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(authToken!, displayedUser!, PAGE_SIZE, this.lastItem);
  }
}
