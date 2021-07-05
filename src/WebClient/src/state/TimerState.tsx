import { makeAutoObservable } from "mobx";
import LobbyState from "./LobbyState";
import PopUpState from "./PopUpState";

type TimeLeft = {
  countDown: boolean;
  minutes: number;
  seconds: number;
};

class TimerManager {
  endTime: Date | undefined;
  startTime: Date | undefined;
  timeLeft: TimeLeft | undefined;
  timerId: number | undefined;
  gameId: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  updateEndTime(endTime: Date) {
    this.endTime = new Date(endTime);
  }

  startTimer(start: Date, end: Date, gameId: string) {
    this.startTime = new Date(start);
    this.endTime = new Date(end);
    this.gameId = gameId;

    this.timerId = window.setInterval(() => {
      this.setTimeLeft(this.calculateTimeLeft());
    }, 250);
  }

  setTimeLeft(timeLeft: TimeLeft) {
    this.timeLeft = timeLeft;
  }

  resetTimer() {
    clearInterval(this.timerId);
    this.endTime = undefined;
    this.startTime = undefined;
    this.timeLeft = undefined;
    this.timerId = undefined;
    this.gameId = undefined;
  }

  calculateTimeLeft() {
    let gameLength = +this.endTime! - +this.startTime!;
    let difference = +this.endTime! - +new Date();
    let timeLeft: TimeLeft;

    if (difference > gameLength) {
      var count = difference - gameLength;
      return {
        countDown: true,
        minutes: Math.floor((count / 1000 / 60) % 60),
        seconds: Math.floor((count / 1000) % 60),
      };
    }

    if (difference > 0) {
      timeLeft = {
        countDown: false,
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = {
        countDown: false,
        minutes: 0,
        seconds: 0,
      };

      TimerState.resetTimer();
      LobbyState.getGame(() => {
        PopUpState.showFinish();
      });
    }

    return timeLeft;
  }
}

const TimerState = new TimerManager();

export default TimerState;
