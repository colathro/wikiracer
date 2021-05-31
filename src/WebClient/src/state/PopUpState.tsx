import { makeAutoObservable } from "mobx";
import crypto from "crypto";
import { reduceEachTrailingCommentRange } from "typescript";

export type MessageType = {
  Id: string;
  Level: Level;
  Text: string;
};

export enum Level {
  Success,
  Warning,
  Error,
}

const generateUniqueId = () => {
  return crypto.randomBytes(16).toString("hex");
};

class PopUpManager {
  displayFinish = false; // flag to display lobby finish
  messages: MessageType[] = []; // fifo-ish queue for managing message to display

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
    const message: MessageType = {
      Id: generateUniqueId(),
      Level: Level.Error,
      Text: text,
    };
    this.schedulePop(message);
    this.messages.push(message);
  }

  showInfo(text: string) {
    const message: MessageType = {
      Id: generateUniqueId(),
      Level: Level.Error,
      Text: text,
    };
    this.schedulePop(message);
    this.messages.push(message);
  }

  showSuccess(text: string) {
    const message: MessageType = {
      Id: generateUniqueId(),
      Level: Level.Success,
      Text: text,
    };
    this.schedulePop(message);
    this.messages.push(message);
  }

  schedulePop(message: MessageType) {
    setTimeout(() => {
      PopUpState.popMessage(message);
    }, 5000);
  }

  popMessage(message: MessageType) {
    var position = this.messages.findIndex((val) => {
      if (val.Id === message.Id) {
        return true;
      } else {
        return false;
      }
    });
    if (position === -1) {
      return; // user closed message
    }
    this.messages.splice(position, 1);
  }
}

var PopUpState = new PopUpManager();

PopUpState.showSuccess("Woot, first message!");

export default PopUpState;
