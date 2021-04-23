import { makeAutoObservable } from "mobx";
import { UserManager, User } from "oidc-client";

var config = {
  authority: " https://id.twitch.tv/oauth2/",
  client_id: "fprj9ag7iy0cq29pbkaarxw26qe2i0",
  redirect_uri: "http://localhost/login",
  response_type: "token id_token",
  scope: "openid",
  post_logout_redirect_uri: "http://localhost",
};

const mgr = new UserManager(config);

class Auth {
  user: any;

  constructor() {
    mgr.getUser().then((user) => {
      if (!user) {
        mgr.signinSilent();
      } else {
        this.user = user;
        console.log(user);
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
    mgr.signoutRedirect();
  }
}

const AuthState = new Auth();

export default AuthState;
