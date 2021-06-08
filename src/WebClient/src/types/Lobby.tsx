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
  key: string;
};

export type PublicLobbyResponse = {
  lobbies: Lobby[];
  pages: number;
};
