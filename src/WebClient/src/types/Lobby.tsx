import { AuthType } from "../enums/AuthType";

export type Lobby = {
  players: LobbyPlayer[];
  banList: string[];
  owner: User;
  running: boolean;
  isPublic: boolean;
  key: string;
  startArticle: string;
  endArticle: string;
  messages: Message[];
};

export type LobbyPlayer = {
  id: string;
  displayName: string;
  avatar: string;
  authProvider: AuthType;
  currentArticle: string;
  finished: boolean;
  active: boolean;
};

export type Message = {
  id: string;
  author: LobbyPlayer;
  text: string;
};

export type User = {
  authProvider: AuthType;
  displayName: string;
  avatar: string;
  createdOn: Date;
  key: string;
};
