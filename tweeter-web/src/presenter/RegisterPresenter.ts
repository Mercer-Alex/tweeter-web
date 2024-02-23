import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";
import { Buffer } from "buffer";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";


export interface RegisterView extends View {
    navigate: NavigateFunction;
    authenticate: (user: User, authtoken: AuthToken) => void;
    setImageUrl(url: string): void;
    setImageBytes(bytes: Uint8Array): void;
}

export class RegisterPresenter extends Presenter {
    private service: UserService;

    public constructor(view: RegisterView) {
        super(view);
        this.service = new UserService();
    }

    protected get view(): RegisterView {
      return super.view as RegisterView;
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array ) {
      this.doFailureRecordingOperation( async () => {
        let [user, authToken] = await this.service.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes
        );
  
        this.view.authenticate(user, authToken);
        this.view.navigate("/");
      },
      "register user");
      };

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


