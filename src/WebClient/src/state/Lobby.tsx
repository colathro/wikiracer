import { makeAutoObservable } from "mobx";
import * as signalR from "@microsoft/signalr";
import { UserManager } from "oidc-client";

var config = {
  authority: " https://id.twitch.tv/oauth2/",
  client_id: "fprj9ag7iy0cq29pbkaarxw26qe2i0",
  redirect_uri: "http://localhost/login",
  response_type: "token id_token",
  scope: "openid",
  post_logout_redirect_uri: "http://localhost",
};

const mgr = new UserManager(config);

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("/gamehub")
  .build();

hubConnection.start();

hubConnection.on("ReceiveMessage", (message) => {
  console.log("got message");
  LobbyManager.recieve(message);
});

hubConnection.on("GameState", (message) => {
  LobbyManager.gameState(message);
});

class Lobby {
  messages: string[] = [];
  user: any;

  constructor() {
    mgr.getUser().then((user) => {
      this.user = user;
      console.log(user);
    });
    makeAutoObservable(this);
  }

  login() {
    mgr.signinRedirect();
  }

  signin() {
    mgr.signinRedirectCallback().then((user) => {
      window.location.href = window.location.origin;
    });
  }

  logout() {
    mgr.signoutRedirect();
  }

  send() {
    console.log("sending message");
    hubConnection.invoke("SendMessage", "Hello World!");
  }

  recieve(message: string) {
    this.messages = [...this.messages, message];
  }

  gameState(game: string) {
    console.log(game);
  }
}

const LobbyManager = new Lobby();

export default LobbyManager;
