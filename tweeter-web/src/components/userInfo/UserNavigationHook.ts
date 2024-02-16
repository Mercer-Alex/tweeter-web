import useUserInfo from "./UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";
import { useState } from "react";

interface UserNavigation {
    navigateToUser: ( event: React.MouseEvent ) => void
  }
  
const useUserNavigation = (): UserNavigation => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
      useUserInfo();

    const listener: UserNavigationView = {
      setDisplayedUser: setDisplayedUser,
      displayErrorMessage: displayErrorMessage,
    }

    const [presenter] = useState(new UserNavigationPresenter(listener));

    return {
        navigateToUser: async (event: React.MouseEvent) => 
            {
              event.preventDefault();
              presenter.navigateToUser(currentUser!, event.target.toString(), authToken!);

            }
    }
}

export default useUserNavigation;
