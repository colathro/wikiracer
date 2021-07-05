import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ThemeManager from "../Themes";
import LobbyState from "../state/LobbyState";
import ConnectionState from "../state/ConnectionState";
import Lobby from "../components/lobby/Lobby";
import AuthState from "../state/AuthState";

const LobbyView = observer(() => {
  const [connectionStarted, setConnectionStarted] = useState(false);
  let history = useHistory();

  useEffect(() => {
    AuthState.getUser();
  }, []);

  ThemeManager.leftNotifications = true;

  if (LobbyState.lobby === null) {
    // error popup here
    history.push("/");
    return <></>;
  }

  useEffect(() => {
    ConnectionState.start(() => {
      setConnectionStarted(true);
    });
  }, []);

  if (!connectionStarted) {
    return <h1>Loading...</h1>;
  }

  return <Lobby />;
});

export default LobbyView;
