import { makeAutoObservable } from "mobx";
import { UserManager } from "oidc-client";

var config = {
  authority: " https://id.twitch.tv/oauth2/",
  client_id: "fprj9ag7iy0cq29pbkaarxw26qe2i0",
  redirect_uri: document.location.origin + "/login",
  response_type: "token id_token",
  scope: "openid user_read",
  post_logout_redirect_uri: document.location.origin,
  extraQueryParams: {
    claims:
      '{"id_token": { "email": null, "email_verified": null, "picture": null, "preferred_username": null }}',
  },
};

const mgr = new UserManager(config);

class Auth {
  user: any;
  appUser: any;

  constructor() {
    mgr.getUser().then((curUser) => {
      if (!curUser) {
      } else {
        this.user = curUser;
        console.log(this.user);
      }
    });
    makeAutoObservable(this);
  }

  login() {
    mgr.signinRedirect();
  }

  signin() {
    mgr.signinRedirectCallback().then((user) => {
      window.location.href = window.location.origin;
    });
  }

  logout() {
    this.user = null;
    mgr.signoutRedirect();
  }

  getUser() {
    fetch(`/api/user/me`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + AuthState.user.id_token,
      },
    })
      .then((response) => response.json())
      .then((data) => (this.appUser = data));
  }
}

const AuthState = new Auth();

export default AuthState;
