import { makeAutoObservable } from "mobx";
import AuthState from "./AuthState";
import LobbyState from "./LobbyState";
import * as signalR from "@microsoft/signalr";
import history from "../History";

class ConnectionManager {
  connection: signalR.HubConnection | undefined;
  stateCallback: any;
  joinKey?: string;

  async start(callback: any) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/lobbyhub", {
        accessTokenFactory: () => AuthState.auth_info!.access_token,
      })
      .build();

    this.connection.onclose(() => {
      history.push("/");
    });

    this.connection.on("LobbyState", (message) => {
      console.log("out callback");
      this.stateCallback(message);
    });

    this.connection.on("LobbyClosed", () => {
      LobbyState.removeLocalLobby();
    });

    await this.connection!.start()
      .then(() => {
        this.fetchJoinKey();
        this.joinLobby();
      })
      .then(() => {
        callback();
      });
  }

  cleanConnection() {
    if (this.connection != undefined) {
      this.connection.stop();
    }
  }

  joinLobby() {
    console.log(`joined ${this.joinKey}`);
    this.connection!.invoke("JoinLobby", this.joinKey);
  }

  fetchJoinKey() {
    this.stateCallback = (lobby: any) => {
      LobbyState.lobbyState(lobby);
    };
    this.joinKey = LobbyState.lobby!.key;
  }
}

const ConnectionState = new ConnectionManager();

export default ConnectionState;
