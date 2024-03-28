import { Buffer } from "buffer";
import { ServerFacade } from "../net/ServerFacade";
import { AuthToken, User, GetUserRequest, LoginRequest, RegisterRequest, LogoutRequest } from "tweeter-shared";

export class UserService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }


  public async getUser(
    authToken: AuthToken,
    username: string
  ): Promise<User | null> {

    const response = await this.serverFacade.getUser(new GetUserRequest(authToken, username));
    return response.user;
  };

  public async login(
    username: string,
    password: string
  ): Promise<[User, AuthToken]> {

    const response = await this.serverFacade.login(new LoginRequest(username, password));

    if (response.user === null) {
      throw new Error("Invalid alias or password");
    }

    return [response.user, response.token];
  };

  public async register(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    let imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const response = await this.serverFacade.register(new RegisterRequest(username, password, firstName, lastName, userImageBytes));

    if (response.user === null) {
      throw new Error("Invalid registration");
    }

    return [response.user, response.token];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await this.serverFacade.logout(new LogoutRequest(authToken));

  };
}
