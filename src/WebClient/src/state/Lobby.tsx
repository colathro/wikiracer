import { makeAutoObservable } from "mobx";
import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("/testhub")
  .build();

hubConnection.start();

hubConnection.on("ReceiveMessage", (message) => {
  console.log("got message");
  LobbyManager.recieve(message);
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
}

const LobbyManager = new Lobby();

export default LobbyManager;
