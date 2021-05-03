import { makeAutoObservable } from "mobx";
import { UserManager } from "oidc-client";

var config = {
  authority: " https://id.twitch.tv/oauth2/",
  client_id: "fprj9ag7iy0cq29pbkaarxw26qe2i0",
  redirect_uri: document.location.origin + "/login",
  response_type: "token id_token",
  scope: "openid",
  post_logout_redirect_uri: document.location.origin,
};

const mgr = new UserManager(config);

class Auth {
  user: any;

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
}

const AuthState = new Auth();

export default AuthState;
