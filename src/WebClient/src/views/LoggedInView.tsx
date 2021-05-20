import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import AuthState from "../state/AuthState";
import LobbyState from "../state/LobbyState";
import LobbyFinderView from "./LobbyFinderView";
import LobbyView from "./LobbyView";

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
      {LobbyState.lobby === null ? <LobbyFinderView /> : <LobbyView />}
    </div>
  );
});

export default LoggedInView;
