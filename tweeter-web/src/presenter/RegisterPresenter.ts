import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { UserService } from "../model/service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageUrl(url: string): void;
  setImageBytes(bytes: Uint8Array): void;
}

export class RegisterPresenter extends AuthPresenter {
  protected get view(): RegisterView {
    return super.view as RegisterView;
  }

  protected createService(): UserService {
    return new UserService();
  }

  protected getItemDescription(): string {
    return "register user";
  }

  protected doAuthentication(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array
  ): Promise<[User, AuthToken]> {
    return this.service.register(
      firstName!,
      lastName!,
      alias,
      password,
      imageBytes!)
  }

  public handleImageFile(file: File | undefined) {

    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };
}
