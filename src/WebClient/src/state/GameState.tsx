import { makeAutoObservable } from "mobx";
import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("/gamehub")
  .build();

hubConnection.start();

hubConnection.on("ReceiveMessage", (message) => {
  console.log("got message");
  GameState.recieve(message);
});

hubConnection.on("GameState", (message) => {
  GameState.gameState(message);
});

class Game {
  messages: string[] = [];

  constructor() {
    makeAutoObservable(this);
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

const GameState = new Game();

export default GameState;
