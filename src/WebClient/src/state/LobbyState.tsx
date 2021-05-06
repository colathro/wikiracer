import { makeAutoObservable } from "mobx";
import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("/lobbyhub")
  .build();

async function start() {
  try {
    await hubConnection.start();
  } catch (err) {
    console.log(err);
    setTimeout(start, 5000);
  }
}

hubConnection.onclose(start);

start();

hubConnection.on("Hello", (message) => {
  console.log("got message");
  LobbyState.recieve(message);
});

hubConnection.on("LobbyState", (message) => {
  LobbyState.lobbyState(message);
});

class Lobby {
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

  lobbyState(lobby: string) {
    console.log(lobby);
  }
}

const LobbyState = new Lobby();

export default LobbyState;
