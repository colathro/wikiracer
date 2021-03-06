﻿class GameState {
  constructor() {
    this.Lobby = null;
    this.Page = null;
    this.Hub = null;
    this.PollingGameState = false;
  }

  registerEventHandlers(hub, setstate) {
    console.log("registering gamestate");
    hub.on(
      "GameState",
      function (message) {
        this.gameState(setstate, message);
      }.bind(this)
    );

    hub.on(
      "WikiReceive",
      function (message) {
        this.wikiReceive(setstate, message);
      }.bind(this)
    );

    console.log("registered gamestate");
  }

  gameState(setstate, message) {
    this.Lobby = JSON.parse(message).Lobby;
    setstate({ game: this });
    console.log(message);

    if (!this.PollingGameState) {
      this.PollingGameState = true;
      setInterval(() => {
        this.getGameState();
      }, 1000);
    }
  }

  wikiReceive(setstate, message) {
    this.Page = message;
    setstate({ game: this });
    console.log("got wiki page");
  }

  wikiGet(page) {
    this.Hub.invoke("WikiGet", page);
  }

  getGameState() {
    this.Hub.invoke("GetGameState", this.Lobby.LobbyName);
  }
}

export const Game = new GameState();
