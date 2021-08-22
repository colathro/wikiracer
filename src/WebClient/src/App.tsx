import { observer } from "mobx-react-lite";
import AuthState from "./state/AuthState";
import { Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import LoginView from "./views/LoginView";
import LoggedInView from "./views/LoggedInView";
import LobbyView from "./views/LobbyView";
import Messages from "./components/popups/Messages";
import history from "./History";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useState } from "react";
import LobbyState from "./state/LobbyState";
import { useEffect } from "react";
import Cookie from "./components/cookie/Cookie";
import { Link, PrimaryButton, Text } from "@fluentui/react";
import TheTeam from "./components/team/TheTeam";

const Layout = styled.div`
  display: flex;
  flex: 1;
`;

const LayoutUnauth = styled.div`
  display: flex;
  flex: 1;
  margin-top: 3em;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BackUnauthed = styled.div`
  float: left;
`;

function App() {
  return (
    <Layout>
      <Messages />
      <Router history={history}>
        <LandingView></LandingView>
      </Router>
    </Layout>
  );
}

const LandingView = observer(() => {
  const [continueLoading, setContinueLoading] = useState(false);
  let location = useLocation();
  let params = queryString.parse(location.search);
  if (params.joinkey != undefined && params.joinkey!.length >= 5) {
    useEffect(() => {
      if (AuthState.auth_info === null) {
        AuthState.loginGuest(() => {
          LobbyState.joinLobby(params.joinkey!.toString(), () => {
            setContinueLoading(true);
            history.push("/lobby");
          });
        });
      } else {
        LobbyState.joinLobby(params.joinkey!.toString(), () => {
          setContinueLoading(true);
          history.push("/lobby");
        });
      }
    }, []);
  } else {
    useEffect(() => {
      setContinueLoading(true);
    }, []);
  }

  if (!continueLoading) {
    return <div>Loading</div>;
  }

  if (AuthState.auth_info === null) {
    return <UnauthenticatedRouting />;
  } else {
    return <AuthenticatedRouting />;
  }
});

const UnauthenticatedRouting = () => {
  return (
    <Switch>
      <Route path="/cookie">
        <LayoutUnauth>
          <BackUnauthed>
            <Link
              onClick={() => {
                history.push("/");
              }}
            >
              <PrimaryButton>Back</PrimaryButton>
            </Link>
          </BackUnauthed>
          <Cookie></Cookie>
        </LayoutUnauth>
      </Route>
      <Route path="/team">
        <LayoutUnauth>
          <BackUnauthed>
            <Link
              onClick={() => {
                history.push("/");
              }}
            >
              <PrimaryButton>Back</PrimaryButton>
            </Link>
          </BackUnauthed>
          <TheTeam></TheTeam>
        </LayoutUnauth>
      </Route>
      <Route path="/">
        <LoginView />
      </Route>
    </Switch>
  );
};

const AuthenticatedRouting = () => {
  return (
    <Switch>
      <Route path="/lobby">
        <LobbyView />
      </Route>
      <Route path="/">
        <LoggedInView />
      </Route>
    </Switch>
  );
};

export default App;
