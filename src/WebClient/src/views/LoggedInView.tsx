import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import AuthState from "../state/AuthState";
import LobbyFinderView from "./LobbyFinderView";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import HowToPlayView from "./HowToPlayView";

const LoggedInView = observer(() => {
  useEffect(() => {
    AuthState.getUser();
  }, []);
  return (
    <div>
      <div>
        <h1>{AuthState.auth_info?.display_name}</h1>
        <button
          onClick={() => {
            AuthState.logout();
          }}
        >
          Logout
        </button>
      </div>
      <Switch>
        <Route path="/howtoplay">
          <HowToPlayView />
        </Route>
        <Route path="/">
          <LobbyFinderView />
        </Route>
      </Switch>
    </div>
  );
});

export default LoggedInView;
