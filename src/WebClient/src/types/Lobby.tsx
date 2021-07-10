import { AuthType } from "../enums/AuthType";

export type Lobby = {
  players: LobbyPlayer[];
  banList: string[];
  owner: Owner;
  isPublic: boolean;
  key: string;
  startArticle: string;
  endArticle: string;
  messages: Message[];
  startTime: Date;
  endTime: Date;
  gameId: string;
};

export type LobbyPlayer = {
  id: string;
  displayName: string;
  avatar: string;
  authProvider: AuthType;
  currentArticle: string;
  finished: boolean;
  finishedTime: Date;
  active: boolean;
  badges: string[];
  level: number;
};

export type Message = {
  id: string;
  author: LobbyPlayer;
  text: string;
};

export type Owner = {
  id: string;
  displayName: string;
  authProvider: AuthType;
};

export type User = {
  authProvider: AuthType;
  displayName: string;
  avatar: string;
  createdOn: Date;
  experience: number;
  unlockedAvatars: string[];
  coins: number;
  badges: string[];
  level: number;
  key: string;
};

export type PublicLobbyResponse = {
  lobbies: Lobby[];
  pages: number;
};

export type Game = {
  finished: boolean;
  startArticle: string;
  finishArticle: string;
  startTime: Date;
  finishTime: Date;
  gameHistories: GameHistory[];
  coinReward: number;
  experienceReward: number;
};

export type GameResponse = {
  games: Game[];
  pages: number;
};

export type GameHistory = {
  player: LobbyPlayer;
  navigations: GameNavigation[];
};

export type GameNavigation = {
  timestamp: Date;
  article: string;
};
