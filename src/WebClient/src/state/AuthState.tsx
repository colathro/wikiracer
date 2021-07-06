import { makeAutoObservable } from "mobx";
import { UserManager } from "oidc-client";
import { AuthType } from "../enums/AuthType";
import { AuthInfo } from "../types/AuthInfo";
import { User } from "../types/Lobby";
import LobbyState from "./LobbyState";

var config = {
  authority: " https://id.twitch.tv/oauth2/",
  client_id: "fprj9ag7iy0cq29pbkaarxw26qe2i0",
  redirect_uri: document.location.origin + "/login",
  response_type: "token id_token",
  scope: "openid",
  post_logout_redirect_uri: document.location.origin,
};

const twitchManager = new UserManager(config);

class Auth {
  auth_info: AuthInfo | undefined;
  user: User | undefined;

  constructor() {
    makeAutoObservable(this);
    this.auth_info = JSON.parse(localStorage.getItem("auth_info")!) as AuthInfo;
    if (document.location.toString().includes("login")) {
      this.handleCallbackTwitch();
    }
  }

  loginTwitch() {
    twitchManager.signinRedirect();
  }

  handleCallbackTwitch() {
    twitchManager.signinRedirectCallback().then((user) => {
      const temp_auth_info = {
        access_token: user.id_token,
        display_name: user.profile.preferred_username!,
        auth_provider: AuthType.Twitch,
      };
      this.setLocalAuthInfo(temp_auth_info);
      window.location.href = window.location.origin;
    });
  }

  loginGuest() {
    fetch(`/api/user/guest`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        this.handleCallbackGuest(data);
      });
  }

  handleCallbackGuest(token_response: any) {
    fetch(`/api/user/me`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token_response.data,
      },
    })
      .then(async (response) => {
        return response.json();
      })
      .then((data) => {
        const temp_auth_info = {
          access_token: token_response.data,
          display_name: data.displayName,
          auth_provider: data.authProvider,
        };
        this.setLocalAuthInfo(temp_auth_info);
      });
  }

  logout() {
    LobbyState.leaveLobby();
    this.auth_info = undefined;
    this.removeLocalAuthInfo();
    twitchManager.signoutRedirect();
    window.location.href = window.location.origin;
  }

  setLocalAuthInfo(auth_info: AuthInfo) {
    this.auth_info = auth_info;
    this.removeLocalAuthInfo();
    localStorage.setItem("auth_info", JSON.stringify(auth_info));
  }

  removeLocalAuthInfo() {
    localStorage.removeItem("auth_info");
  }

  getUser() {
    fetch(`/api/user/me`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + AuthState.auth_info?.access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => this.setUser(data));
  }

  setUser(user: User | undefined) {
    this.user = user;
  }
}

const AuthState = new Auth();

export default AuthState;
