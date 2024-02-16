import { StatusItemPresenter, StatusItemView } from './StatusItemPresenter.js';
import { StatusService } from '../model/service/StatusService.js';
import { AuthToken, Status, User } from 'tweeter-shared';
export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter {
    private service: StatusService;

    public constructor(view: StatusItemView) {
        super(view);
        this.service = new StatusService();
    }

    private lastItem: Status | null = null;

    public async loadMoreItems(authToken: AuthToken, displayedUser: User): Promise<void> {
        try {
            if (this.hasMoreItems) {
              let [newItems, hasMore] = await this.service.loadMoreStoryItems(
                authToken!,
                displayedUser!,
                PAGE_SIZE,
                this.lastItem
              );
      
              this.hasMoreItems = hasMore;
              this.lastItem = newItems[newItems.length - 1];
              this.view.addItems(newItems);
            }
          } catch (error) {
            this.view.displayErrorMessage(
              `Failed to load story items because of exception: ${error}`
            );
          }
    }
}