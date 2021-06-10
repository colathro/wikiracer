import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import AuthState from "../state/AuthState";
import ThemeManager from "../Themes";
import LobbyFinder from "../components/lobbyfinder/LobbyFinder";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import HowToPlay from "../components/howtoplay/HowToPlay";
import Nav from "../components/nav/Nav";
import styled from "styled-components";
import Settings from "../components/settings/Settings";
import LobbyState from "../state/LobbyState";
import ConnectionState from "../state/ConnectionState";
import TimerState from "../state/TimerState";

const Layout = styled.div`
  display: flex;
  flex: 1;
`;

const NavWrapper = styled.div`
  display: flex;
  width: 13em;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2em;
`;

const LoggedInView = observer(() => {
  ThemeManager.leftNotifications = false;
  useEffect(() => {
    AuthState.getUser();
    LobbyState.removeLocalLobby();
    ConnectionState.cleanConnection();
    TimerState.resetTimer();
  }, []);
  return (
    <Layout>
      <NavWrapper>
        <Nav />
      </NavWrapper>
      <ContentWrapper>
        <Switch>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/howtoplay">
            <HowToPlay />
          </Route>
          <Route path="/">
            <LobbyFinder />
          </Route>
        </Switch>
      </ContentWrapper>
    </Layout>
  );
});

export default LoggedInView;
