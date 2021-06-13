import { makeAutoObservable } from "mobx";
import AuthState from "./AuthState";
import { Game, Lobby, LobbyPlayer } from "../types/Lobby";
import PopUpState from "./PopUpState";
import TimerState from "./TimerState";
import SharedReferences from "./SharedReferences";

class LobbyManager {
  lobby: Lobby | null;
  me: LobbyPlayer | undefined;
  game: Game | undefined;

  constructor() {
    this.lobby = JSON.parse(localStorage.getItem("lobby")!) as Lobby;
    makeAutoObservable(this);
  }

  lobbyState(lobby: Lobby) {
    this.setLocalLobby(lobby);
    this.checkBan();
    this.updateMe();

    if (
      this.isStarting() &&
      this.lobby?.startArticle != SharedReferences.articleRef!.current &&
      this.lobby?.startArticle != undefined
    ) {
      console.log("settings start");
      this.getArticle(lobby.startArticle!, (data: any) => {
        SharedReferences.articleRef!.current = lobby.startArticle!;
        SharedReferences.articleHook!(data);
      });
    } else if (
      !this.isStarting() &&
      !this.isStarted() &&
      this.lobby?.startArticle != SharedReferences.articleRef!.current &&
      this.lobby?.startArticle != undefined
    ) {
      this.getArticle(lobby.startArticle!, (data: any) => {
        SharedReferences.articleRef!.current = lobby.startArticle!;
        SharedReferences.articleHook!(data);
      });
    }

    if (
      this.lobby?.gameId! !== TimerState.gameId! &&
      TimerState.gameId! !== undefined
    ) {
      console.log("timer reset");
      this.getArticle(lobby.startArticle!, (data: any) => {
        SharedReferences.articleRef!.current = lobby.startArticle!;
        SharedReferences.articleHook!(data);
      });
      TimerState.resetTimer();
    }

    if (this.isStarting() || this.isStarted()) {
      if (TimerState.gameId !== this.lobby?.gameId!) {
        console.log("starting timer");
        // game is running and its correct Id
        TimerState.startTimer(lobby.startTime!, lobby.endTime!, lobby.gameId);
      }
    }
  }

  checkBan() {
    if (this.lobby!.banList!.includes(AuthState.user!.key)) {
      this.leaveLobby();
    }
  }

  checkOwner() {
    return this.lobby?.owner.id === AuthState.user?.key;
  }

  updateMe() {
    console.log(this.lobby);
    const me = this.lobby?.players.filter(
      (player) => player.id === AuthState.user?.key
    )[0];
    console.log(me);
    this.me = me;
  }

  meFinished() {
    return this.me?.finished;
  }

  isStarted() {
    return (
      new Date(this.lobby?.startTime!) <= new Date() &&
      new Date(this.lobby?.endTime!) >= new Date()
    );
  }

  isStarting() {
    var starting = new Date(this.lobby?.startTime!);
    starting.setSeconds(-10);
    return (
      starting <= new Date() && new Date(this.lobby?.startTime!) >= new Date()
    );
  }

  shouldStart(lobby: Lobby) {
    return lobby.startTime! >= new Date() && lobby.endTime! >= new Date();
  }

  getArticle(key: string, callback: any) {
    if (!LobbyState.isStarted() && key != LobbyState.lobby?.startArticle) {
      PopUpState.showError("Wait for game to start!");
      return;
    }
    fetch(
      `/api/lobby/player/article?lobbyKey=${this.lobby?.key}&key=${key}&useStorageAccount=false`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + AuthState.auth_info?.access_token,
        },
      }
    )
      .then(async (response) => {
        if (response.status === 400) {
          const err = await response.text();
          if (err === "already finished") {
            PopUpState.showSuccess(
              "You are already finished! Wait for the round to end."
            );
            return null;
          }
        }
        const resp = await response.json();
        console.log(resp);
        return resp;
      })
      .then((data) => {
        if (data != null) {
          callback(data);
        }
      });
  }

  getLobbies(callback: any, page: number = 0) {
    fetch(`/api/lobby/public?page=${page}`, {
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

  getGame(callback: any) {
    fetch(`/api/lobby/player/currentgame?lobbyKey=${this.lobby?.key}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + AuthState.auth_info?.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.game = data;
        callback(data);
      });
  }

  leaveLobby() {
    if (this.lobby === null) {
      return true;
    }
    this.removeLocalLobby();
    TimerState.resetTimer();
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

  startGame(callback: any) {
    fetch(`/api/lobby/owner/start?lobbyKey=${this.lobby?.key}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AuthState.auth_info?.access_token,
      },
    }).then(() => {
      callback();
    });
  }

  async searchArticles(
    searchTerm: React.MutableRefObject<string>,
    callback: any
  ) {
    fetch(
      `/api/lobby/owner/search?lobbyKey=${this.lobby?.key}&term=${searchTerm.current}`,
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
}

const LobbyState = new LobbyManager();

export default LobbyState;
