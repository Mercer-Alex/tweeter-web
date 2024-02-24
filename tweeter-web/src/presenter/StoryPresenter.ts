import { PAGE_SIZE } from './PagedItemPresenter.js';
import { StatusItemPresenter } from './StatusItemPresenter.js';
import { AuthToken, Status, User } from 'tweeter-shared';

export class StoryPresenter extends StatusItemPresenter {
  protected getItemDescription(): string {
    return "load story items";
  }
  protected getMoreItems(authToken: AuthToken, displayedUser: User): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(authToken, displayedUser, PAGE_SIZE, this.lastItem);
  }
}
