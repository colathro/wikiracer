import { makeAutoObservable } from "mobx";
import AuthState from "./AuthState";
import ConnectionState from "./ConnectionState";
import { Lobby } from "../types/Lobby";

class LobbyManager {
  lobby: Lobby | null;

  constructor() {
    this.lobby = JSON.parse(localStorage.getItem("lobby")!) as Lobby;
    makeAutoObservable(this);
  }

  lobbyState(lobby: Lobby) {
    this.setLocalLobby(lobby);
    this.checkBan();
  }

  checkBan() {
    if (this.lobby!.banList!.includes(AuthState.user!.key)) {
      this.leaveLobby();
    }
  }

  checkOwner() {
    return this.lobby?.owner.key == AuthState.user?.key;
  }

  getArticle(key: string, useStorageAccount: boolean, callback: any) {
    fetch(
      `/api/lobby/player/article?lobbyKey=${this.lobby?.key}&key=${key}&useStorageAccount=${useStorageAccount}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + AuthState.auth_info?.access_token,
        },
      }
    )
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
      .then((response) => {
        if (response.status == 200) return response.json();
      })
      .then((data) => {
        if (data) {
          this.setLocalLobby(data);
          callback(data);
        }
      });
  }

  sendMessage(message: string, callback: any) {
    fetch(
      `/api/lobby/player/message?lobbyKey=${this.lobby?.key}&message=${message}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + AuthState.auth_info?.access_token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      });
  }

  leaveLobby() {
    if (this.lobby === null) {
      return true;
    }
    this.removeLocalLobby();
  }

  setLocalLobby(lobby: Lobby) {
    this.removeLocalLobby();
    this.lobby = lobby;
    localStorage.setItem("lobby", JSON.stringify(lobby));
  }

  removeLocalLobby() {
    this.lobby = null;
    localStorage.removeItem("lobby");
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

  banPlayer(playerId: string, callback: any) {
    fetch(
      `/api/lobby/owner/ban?lobbyKey=${this.lobby?.key}&userKey=${playerId}`,
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

  setArticles(startArticle: string, finishArticle: string, callback: any) {
    fetch(
      `/api/lobby/owner/setarticle?lobbyKey=${this.lobby?.key}&start=${startArticle}&finish=${finishArticle}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + AuthState.auth_info?.access_token,
        },
      }
    ).then(() => {
      callback();
    });
  }

  async searchArticles(searchTerm: string) {
    let res = await fetch(
      `/api/lobby/owner/search?lobbyKey=${this.lobby?.key}&term=${searchTerm}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + AuthState.auth_info?.access_token,
        },
      }
    );
    return await res.json();
  }
}

const LobbyState = new LobbyManager();

export default LobbyState;
