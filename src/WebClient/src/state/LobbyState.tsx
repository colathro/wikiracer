import { makeAutoObservable } from "mobx";
import AuthState from "./AuthState";
import * as signalR from "@microsoft/signalr";
import { Lobby } from "../types/Lobby";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("/lobbyhub", {
    accessTokenFactory: () => AuthState.auth_info!.access_token,
  })
  .build();

async function start() {
  try {
    await hubConnection.start();
  } catch (err) {
    console.log(err);
    setTimeout(start, 5000);
  }
}

hubConnection.onclose(() => {
  start();
});

hubConnection.on("LobbyState", (message) => {
  LobbyState.lobbyState(message);
});

class LobbyManager {
  lobby: Lobby | null;

  constructor() {
    this.lobby = JSON.parse(localStorage.getItem("lobby")!) as Lobby;
    makeAutoObservable(this);
  }

  send() {
    console.log("sending message");
    hubConnection.invoke("SendMessage", "Hello World!");
  }

  lobbyState(lobby: Lobby) {
    this.lobby = lobby;
    console.log(lobby);
  }

  getArticle(key: string, callback: any) {
    fetch(`/api/article?key=${key}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + AuthState.auth_info?.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      });
  }

  getLobbies(callback: any) {
    fetch(`/api/lobby/public`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + AuthState.auth_info?.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      });
  }

  createLobby(callback: any) {
    fetch(`/api/lobby/create`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AuthState.auth_info?.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setLocalLobby(data);
        callback(data);
      });
  }

  joinLobby(key: string, callback: any) {
    fetch(`/api/lobby/join?lobbyKey=${key}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AuthState.auth_info?.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setLocalLobby(data);
        this.joinWSGroup();
        callback(data);
      });
  }

  leaveLobby() {
    if (this.lobby === null) {
      return true;
    }
    hubConnection.invoke("LeaveLobby");
    this.removeLocalLobby();
  }

  setLocalLobby(lobby: Lobby) {
    this.removeLocalLobby();
    this.lobby = lobby;
    localStorage.setItem("lobby", JSON.stringify(lobby));
    this.getLocalLobby();
  }

  joinWSGroup() {
    hubConnection.invoke("JoinLobby", this.lobby!.key);
  }

  removeLocalLobby() {
    this.lobby = null;
    localStorage.removeItem("lobby");
  }

  getLocalLobby() {
    JSON.parse(localStorage.getItem("lobby")!) as Lobby;
  }

  setPublic(callback: any) {
    fetch(
      `/api/lobby/owner/setPublic?lobbyKey=${this.lobby?.key}&isPublic=${!this
        .lobby?.isPublic}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + AuthState.auth_info?.access_token,
        },
      }
    ).then(() => {
      callback();
    });
  }

  startHubConnection() {
    start();
  }
}

const LobbyState = new LobbyManager();

export default LobbyState;
