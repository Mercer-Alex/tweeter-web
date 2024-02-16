import { AuthToken, Status, User } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import StatusItem from "../statusItem/StatusItem";
import useUserInfo from "../userInfo/UserInfoHook";
import { StatusItemPresenter, StatusItemView } from "../../presenter/StatusItemPresenter";


interface Prop {
  presenterGenerator: (view: StatusItemView) => StatusItemPresenter;
}

const StatusItemScroller = (props: Prop) => {
    const { displayErrorMessage } = useToastListener();
    const [items, setItems] = useState<Status[]>([]);

    // Required to allow the addItems method to see the current value of 'items'
    // instead of the value from when the closure was created.
    const itemsReference = useRef(items);
    itemsReference.current = items;
  
    const { displayedUser, authToken } = useUserInfo();
  
    // Load initial items
    useEffect(() => {
      loadMoreItems();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const listener: StatusItemView = {
      addItems: (newItems: Status[]) => setItems([...itemsReference.current, ...newItems]),
      displayErrorMessage: displayErrorMessage,
    }

    const [presenter] = useState(props.presenterGenerator(listener));
  
    const loadMoreItems = async () => {
     presenter.loadMoreItems(authToken!, displayedUser!);
    };
  
    return (
      <div className="container px-0 overflow-visible vh-100">
          <InfiniteScroll
            className="pr-0 mr-0"
            dataLength={items.length}
            next={loadMoreItems}
            hasMore={presenter.hasMoreItems}
            loader={<h4>Loading...</h4>}
          >
            <StatusItem items={items}/>
        </InfiniteScroll>
      </div>
    );
  };

export default StatusItemScroller;
