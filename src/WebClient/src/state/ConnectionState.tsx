import { makeAutoObservable } from "mobx";
import AuthState from "./AuthState";
import LobbyState from "./LobbyState";
import * as signalR from "@microsoft/signalr";
import { isThisTypeNode } from "typescript";

class ConnectionManager {
  connection: signalR.HubConnection;
  active: boolean = false;
  stateCallback: any;
  joinKey?: string;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/lobbyhub", {
        accessTokenFactory: () => AuthState.auth_info!.access_token,
      })
      .build();

    this.connection.onclose(() => {
      // make sure we join lobby here
      this.start(() => {});
    });

    this.connection.on("LobbyState", (message) => {
      console.log("out callback");
      this.stateCallback(message);
    });
  }

  async start(callback: any) {
    if (!this.active) {
      await this.connection
        .start()
        .then(() => {
          this.active = true;
          this.fetchJoinKey();
          this.joinLobby();
        })
        .then(() => {
          callback();
        });
    } else {
      this.fetchJoinKey();
      this.joinLobby();
      callback();
    }
  }

  joinLobby() {
    console.log(`joined ${this.joinKey}`);
    this.connection.invoke("JoinLobby", this.joinKey);
  }

  leaveLobby() {
    this.connection.invoke("LeaveLobby");
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
