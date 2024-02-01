import { AuthToken, FakeData, User } from "tweeter-shared";
import useUserInfo from "./UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";

interface UserNavigation {
    navigateToUser: ( event: React.MouseEvent ) => void
}

const useUserNavigation = (): UserNavigation => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
      useUserInfo();

    const extractAlias = (value: string): string => {
        let index = value.indexOf("@");
        return value.substring(index);
      };
    
      const getUser = async (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
      };

    return {
        navigateToUser: async (event: React.MouseEvent) => 
            {event.preventDefault();

                try {
                  let alias = extractAlias(event.target.toString());
            
                  let user = await getUser(authToken!, alias);
            
                  if (!!user) {
                    if (currentUser!.equals(user)) {
                      setDisplayedUser(currentUser!);
                    } else {
                      setDisplayedUser(user);
                    }
                  }
                } catch (error) {
                  displayErrorMessage(`Failed to get user because of exception: ${error}`);
                }
            }
    }
}

export default useUserNavigation;
