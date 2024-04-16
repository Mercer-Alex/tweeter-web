import { AuthToken, User, Status, LoadMoreStatusItemsRequest, PostStatusRequest } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";


export class StatusService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {

    const response = await this.serverFacade.loadMoreFeedItems(new LoadMoreStatusItemsRequest(authToken, user, pageSize, lastItem));
    return [response.itemsList, response.hasMoreItems];
  };

  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const response = await this.serverFacade.loadMoreStoryItems(new LoadMoreStatusItemsRequest(authToken, user, pageSize, lastItem));
    return [response.itemsList, response.hasMoreItems];
  };

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    await this.serverFacade.postStatus(new PostStatusRequest(authToken, newStatus));
  };
}
