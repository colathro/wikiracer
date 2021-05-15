import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import AuthState from "./state/AuthState";
import GameState from "./state/LobbyState";
import "./App.css";
import LobbyState from "./state/LobbyState";

function App() {
  return (
    <div>
      <AuthTest></AuthTest>
    </div>
  );
}

const AuthTest = observer(() => {
  return (
    <div>{AuthState.auth_info === null ? <LoginView /> : <LoggedInView />}</div>
  );
});

const LoginView = observer(() => {
  return (
    <div>
      <button
        onClick={() => {
          AuthState.loginGuest();
        }}
      >
        Sign in as guest
      </button>
      <button
        onClick={() => {
          AuthState.loginTwitch();
        }}
      >
        Sign in with Twitch
      </button>
    </div>
  );
});

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

const LobbyFinderView = observer(() => {
  const [lobbies, setLobbies] = useState<any>([]);

  useEffect(() => {
    AuthState.getUser();
    LobbyState.getLobbies(setLobbies);
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          LobbyState.createLobby((d: any) => {
            console.log(d);
          });
        }}
      >
        Create Lobby
      </button>
      <div>
        <h1>Lobbies</h1>
        <ul>
          {lobbies.map((lobby: any, key: any) => {
            return (
              <li key={key}>
                {lobby.key} {lobby.owner.displayName}{" "}
                <button
                  onClick={() => {
                    LobbyState.joinLobby(lobby.key, () => {});
                  }}
                >
                  Join
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

const LobbyView = observer(() => {
  useEffect(() => {
    LobbyState.joinLobby(LobbyState.lobby!.key, () => {});
  }, []);

  return (
    <div>
      <div>{LobbyState.lobby!.key}</div>
      <button
        onClick={() => {
          LobbyState.leaveLobby();
        }}
      >
        Leave Lobby
      </button>
      <button
        onClick={() => {
          LobbyState.setPublic(() => {});
        }}
      >
        Toggle Public
      </button>
    </div>
  );
});

export default App;
