import { AuthToken, User, LoadMoreFollowersRequest, LoadMoreFolloweesRequest, GetIsFollowerStatusRequest, GetFolloweesCountRequest, GetFollowersCountRequest, FollowRequest, UnfollowRequest } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const response = await this.serverFacade.loadMoreFollowers(new LoadMoreFollowersRequest(authToken, user, pageSize, lastItem))

    return [response.itemsList, response.hasMoreItems,]
  };

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {

    const response = await this.serverFacade.loadMoreFollowees(new LoadMoreFolloweesRequest(authToken, user, pageSize, lastItem));

    return [response.itemsList, response.hasMoreItems,]
  };

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {

    const response = await this.serverFacade.getIsFollowerStatus(new GetIsFollowerStatusRequest(authToken, user, selectedUser));
    console.log('follower..............')
    console.log(response);
    return response._isFollower;
  };

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {

    const response = await this.serverFacade.getFolloweesCount(new GetFolloweesCountRequest(authToken, user));
    return response.count;
  };

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {

    const response = await this.serverFacade.getFollowersCount(new GetFollowersCountRequest(authToken, user));
    return response.count;
  };

  public async follow(
    authToken: AuthToken,
    user: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the following message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    await this.serverFacade.follow(new FollowRequest(authToken, user));

    let followersCount = await this.getFollowersCount(authToken, user);
    let followeesCount = await this.getFolloweesCount(authToken, user);

    return [followersCount, followeesCount];
  };

  public async unfollow(
    authToken: AuthToken,
    user: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the unfollowing message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    await this.serverFacade.unfollow(new UnfollowRequest(authToken, user));

    let followersCount = await this.getFollowersCount(authToken, user);
    let followeesCount = await this.getFolloweesCount(authToken, user);

    return [followersCount, followeesCount];
  };
}