import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { Link } from "react-router-dom";
import Post from "../statusItem/Post";
import useToastListener from "../toaster/ToastListenerHook";

export const PAGE_SIZE = 10;

interface Props {
    items: Status[];
}

const StatusItem = (props: Props) => {

    const { displayErrorMessage } = useToastListener();

    const { displayedUser, setDisplayedUser, currentUser, authToken } =
        useContext(UserInfoContext);


    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
    
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
      };

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

    return (
      <>
        {props.items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <div className="col bg-light mx-0 px-0">
              <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={item.user.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                        {item.user.firstName} {item.user.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={item.user.alias}
                        onClick={(event) => navigateToUser(event)}
                      >
                        {item.user.alias}
                      </Link>
                    </h2>
                    {item.formattedDate}
                    <br />
                    <Post status={item} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    )
};

export default StatusItem;
