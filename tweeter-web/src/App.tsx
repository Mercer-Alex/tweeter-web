import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { UserItemView } from "./presenter/UserItemPresenter";
import { FollowingPresenter } from "./presenter/FollowingPresenter";
import { FollowersPresenter } from "./presenter/FollowersPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StatusItemView } from "./presenter/StatusItemPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { LoginPresenter } from "./presenter/LoginPresenter";
import { RegisterView, RegisterPresenter } from "./presenter/RegisterPresenter";
import { AuthView } from "./presenter/AuthPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import { Status, User } from "tweeter-shared";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();;

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route path="feed"
          element={<ItemScroller
            key={"feed"}
            presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
            itemComponentGenerator={(item: Status): JSX.Element => {
              return <StatusItem item={item} />
            }}
          />
          }
        />
        <Route path="story"
          element={
            <ItemScroller
              key={"story"}
              presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
              itemComponentGenerator={(item: Status): JSX.Element => {
                return <StatusItem item={item} />
              }}
            />
          }
        />
        <Route
          path="following"
          element={
            <ItemScroller
              key={"following"}
              presenterGenerator={(view: UserItemView) => new FollowingPresenter(view)}
              itemComponentGenerator={(item: User): JSX.Element => {
                return <UserItem value={item} />
              }}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={"followers"}
              presenterGenerator={(view: UserItemView) => new FollowersPresenter(view)}
              itemComponentGenerator={(item: User): JSX.Element => {
                return <UserItem value={item} />
              }}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login presenterGenerator={(view: AuthView) => new LoginPresenter(view)} />} />
      <Route path="/register" element={<Register presenterGenerator={(view: RegisterView) => new RegisterPresenter(view)} />} />
      <Route path="*" element={<Login originalUrl={location.pathname} presenterGenerator={(view: AuthView) => new LoginPresenter(view)} />} />
    </Routes>
  );
};

export default App;
