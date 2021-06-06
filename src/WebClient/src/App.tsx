import { observer } from "mobx-react-lite";
import AuthState from "./state/AuthState";
import { Router, Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";
import LoginView from "./views/LoginView";
import LoggedInView from "./views/LoggedInView";
import LobbyView from "./views/LobbyView";
import Messages from "./components/popups/Messages";
import history from "./History";

const Layout = styled.div`
  display: flex;
  flex: 1;
`;

function App() {
  return (
    <Layout>
      <Messages />
      <LandingView></LandingView>
    </Layout>
  );
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
    <Router history={history}>
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
    <Router history={history}>
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
