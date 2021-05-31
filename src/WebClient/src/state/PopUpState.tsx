import { makeAutoObservable } from "mobx";

type Message = {
  Level: Level;
  Text: string;
};

enum Level {
  Info,
  Warning,
  Error,
}

class PopUpManager {
  displayFinish = false; // flag to display lobby finish
  messages: Message[] = []; // fifo-ish queue for managing message to display

  constructor() {
    makeAutoObservable(this);
  }

  closeFinish() {
    this.displayFinish = false;
  }

  showFinish() {
    this.displayFinish = true;
  }

  showError(text: string) {
    const message: Message = {
      Level: Level.Error,
      Text: text,
    };
    this.messages.push(message);
  }

  showInfo(text: string) {
    const message: Message = {
      Level: Level.Error,
      Text: text,
    };
    this.messages.push(message);
  }

  popMessage(position: number) {
    this.messages.splice(position, 1);
  }

  popOldestMessage() {
    if (this.messages.length >= 1) {
      this.messages.splice(0, 1);
    }
  }
}

var PopUpState = new PopUpManager();

// bop the oldest message every 5 seconds
setTimeout(() => {
  PopUpState.popOldestMessage();
}, 5000);

export default PopUpState;
