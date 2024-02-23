import { User, AuthToken } from "tweeter-shared";

export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void;
    clearLastInfoMessage: () => void;
}

export class Presenter {
    private _view: View;

    protected constructor(view: View) {
        this._view = view;
    }

    protected get view() {
        return this._view;
    }

    protected async doFailureRecordingOperation(operation: () => Promise<void>, operationDescription: string) {
        try {
           await operation()
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to ${operationDescription} because of exception: ${error}`
          );
        }
      };
}