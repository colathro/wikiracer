import { observer } from "mobx-react-lite";
import AuthState from "./state/AuthState";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginView from "./views/LoginView";
import LoggedInView from "./views/LoggedInView";
import LobbyView from "./views/LobbyView";

function App() {
  return <LandingView></LandingView>;
}

const LandingView = observer(() => {
  if (AuthState.auth_info === null) {
    return <UnauthenticatedRouting />;
  } else {
    return <AuthenticatedRouting />;
  }
});

const UnauthenticatedRouting = () => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <LoginView />
        </Route>
      </Switch>
    </Router>
  );
};

const AuthenticatedRouting = () => {
  return (
    <Router>
      <Switch>
        <Route path="/lobby">
          <LobbyView />
        </Route>
        <Route path="/">
          <LoggedInView />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
