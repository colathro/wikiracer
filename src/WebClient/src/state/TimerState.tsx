import { makeAutoObservable } from "mobx";

type TimeLeft = {
  countDown: boolean;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft = (start: Date, end: Date) => {
  let gameLength = +end - +start;
  let difference = +end - +new Date();
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
  }

  return timeLeft;
};

class TimerManager {
  endTime: Date | undefined;
  startTime: Date | undefined;
  timeLeft: TimeLeft | undefined;
  timerId: NodeJS.Timeout | undefined;
  gameId: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  startTimer(start: Date, end: Date, gameId: string) {
    this.startTime = new Date(start);
    this.endTime = new Date(end);
    this.gameId = gameId;

    this.timerId = setInterval(() => {
      this.setTimeLeft(calculateTimeLeft(this.startTime!, this.endTime!));
    }, 500);
  }

  setTimeLeft(timeLeft: TimeLeft) {
    this.timeLeft = timeLeft;
  }

  resetTimer() {
    clearInterval(this.timerId!);
    this.endTime = undefined;
    this.startTime = undefined;
    this.timeLeft = undefined;
    this.timerId = undefined;
    this.gameId = undefined;
  }
}

const TimerState = new TimerManager();

export default TimerState;
