import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserView extends MessageView {
  setIsFollowerStatus: (isFollower: boolean) => void;
  setNumbFollowees: (count: number) => void;
  setNumbFollowers: (count: number) => void;
}

export class UserPresenter extends Presenter {
  private service: FollowService;

  public constructor(view: UserView) {
    super(view);
    this.service = new FollowService();
  }

  protected get view(): UserView {
    return super.view as UserView;
  }

  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
    this.doFailureRecordingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollowerStatus(false);
      } else {
        this.view.setIsFollowerStatus(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)

        );
      }
    }, "determine follower status");
  };

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureRecordingOperation(async () => {
      this.view.setNumbFollowees(await this.service.getFolloweesCount(authToken, displayedUser));
    }, "get followees count");
  };

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureRecordingOperation(async () => {
      this.view.setNumbFollowers(await this.service.getFollowersCount(authToken, displayedUser));
    }, " get followers count");
  };

  public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
    this.doFailureRecordingOperation(async () => {
      this.view.displayInfoMessage(
        `Removing ${displayedUser!.name} from followers...`,
        0
      );

      let [followersCount, followeesCount] = await this.service.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.view.setIsFollowerStatus(false);
      this.view.setNumbFollowers(followersCount);
      this.view.setNumbFollowees(followeesCount);
    }, " unfollow user");
  };

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    this.doFailureRecordingOperation(async () => {
      this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);

      let [followersCount, followeesCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.view.setIsFollowerStatus(true);
      this.view.setNumbFollowers(followersCount);
      this.view.setNumbFollowees(followeesCount);
    }, "follow user");
  };
}