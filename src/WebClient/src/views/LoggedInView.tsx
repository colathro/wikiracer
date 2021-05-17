import { observer } from "mobx-react-lite";
import AuthState from "../state/AuthState";
import LobbyState from "../state/LobbyState";
import LobbyFinderView from "./LobbyFinderView";
import LobbyView from "./LobbyView";

const LoggedInView = observer(() => {
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
