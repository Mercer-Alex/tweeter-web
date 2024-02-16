import { AuthToken, User } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";
import { NavigateFunction } from "react-router-dom";
import { Buffer } from "buffer";
import { useState } from "react";


export interface RegisterView {
    displayErrorMessage: (message: string) => void;
    navigate: NavigateFunction;
    authenticate: (user: User, authtoken: AuthToken) => void;
}

export class RegisterPresenter {
    private view: RegisterView;
    private service: LoginService;

    private _imageUrl: string = "";
    private _imageBytes: Uint8Array = new Uint8Array();
    

    public constructor(view: RegisterView) {
        this.view = view;
        this.service = new LoginService();
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array ) {
        try {
          let [user, authToken] = await this.service.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes
          );
    
          this.view.authenticate(user, authToken);
          this.view.navigate("/");
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to register user because of exception: ${error}`
          );
        }
      };

      public handleImageFile(file: File | undefined) {
        
        if (file) {
          this.imageUrl = URL.createObjectURL(file);
    
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
    
            this.imageBytes = bytes;
          };
          reader.readAsDataURL(file);
        } else {
         this.imageUrl = "";
         this.imageBytes = new Uint8Array();
        }
      };

    public get imageBytes() {
        return this._imageBytes;
    }

    protected set imageBytes(value: Uint8Array) {
        this._imageBytes = value;
    }

    public get imageUrl() {
        return this._imageUrl;
    }

    protected set imageUrl(value: string) {
        this._imageUrl = value;
    }
}


