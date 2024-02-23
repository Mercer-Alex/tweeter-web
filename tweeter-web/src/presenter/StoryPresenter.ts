import { StatusItemPresenter, StatusItemView } from './StatusItemPresenter.js';
import { StatusService } from '../model/service/StatusService.js';
import { AuthToken, User } from 'tweeter-shared';
export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter {
    private service: StatusService;

    public constructor(view: StatusItemView) {
        super(view);
        this.service = new StatusService();
    }

    protected get view(): StatusItemView {
      return super.view as StatusItemView;
    }

    public async loadMoreItems(authToken: AuthToken, displayedUser: User): Promise<void> {
      this.doFailureRecordingOperation(async () => {
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
      },
      "load story items");
    }
}