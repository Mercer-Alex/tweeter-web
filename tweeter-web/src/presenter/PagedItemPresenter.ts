import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
    addItems: (items: T[]) => void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter {
    private _service: U;
    private _hasMoreItems: boolean = true;
    private _lastItem: T | null = null;

    protected constructor(view: PagedItemView<T>) {
        super(view);
        this._service = this.createService();
    }

    protected get view(): PagedItemView<T> {
        return super.view as PagedItemView<T>;
    }

    protected abstract createService(): U;

    protected get service() {
        return this._service;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected get lastItem(): T | null {
        return this._lastItem;
    }

    protected set lastItem(value: T | null) {
        this._lastItem = value;
    }

    public async loadMoreItems(authToken: AuthToken, displayedUser: User) {
        this.doFailureRecordingOperation(async () => {
            if (this.hasMoreItems) {
                let [newItems, hasMore] = await this.getMoreItems(authToken, displayedUser);
                this.hasMoreItems = hasMore;
                this.lastItem = newItems[newItems.length - 1]
                this.view.addItems(newItems);
            }
        },
            this.getItemDescription());
    };

    protected abstract getItemDescription(): string;

    protected abstract getMoreItems(authToken: AuthToken, displayedUser: User): Promise<[T[], boolean]>;
}

