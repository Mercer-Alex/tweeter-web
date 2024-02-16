import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void;
    clearLastInfoMessage: () => void;
    setIsFollowerStatus: (isFollower: boolean) => void;
    setNumbFollowees: (count: number) => void;
    setNumbfollowers: (count: number) => void;
}

export class UserPresenter {
    private view: UserView;
    private service: UserService;

    public constructor(view: UserView) {
        this.view = view;
        this.service = new UserService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        try {
          if (currentUser === displayedUser) {
            this.view.setIsFollowerStatus(false);
          } else {
            this.view.setIsFollowerStatus(
              await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`
          );
        }
      };

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        try {
          this.view.setNumbFollowees(await this.service.getFolloweesCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to get followees count because of exception: ${error}`
          );
        }
      };

      public async setNumbFollowers(authToken: AuthToken, displayedUser: User)  {
        try {
            this.view.setNumbfollowers(await this.service.getFollowersCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to get followers count because of exception: ${error}`
          );
        }
      };

     
      public async follow(
        authToken: AuthToken,
        userToFollow: User
      ): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the following message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        let followersCount = await this.service.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.service.getFolloweesCount(authToken, userToFollow);
    
        return [followersCount, followeesCount];
      };
    
      
      public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
      ): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the unfollowing message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        let followersCount = await this.service.getFollowersCount(authToken, userToUnfollow);
        let followeesCount = await this.service.getFolloweesCount(authToken, userToUnfollow);
    
        return [followersCount, followeesCount];
      };

}