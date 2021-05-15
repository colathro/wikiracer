import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import AuthState from "./state/AuthState";
import GameState from "./state/LobbyState";
import "./App.css";

function App() {
  return (
    <div>
      <AuthTest></AuthTest>
    </div>
  );
}

const AuthTest = observer(() => {
  return (
    <div>
      <div>
        {AuthState.auth_info === null ? <LoginView /> : <LoggedInView />}
      </div>
    </div>
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
  const [lobbies, setLobbies] = useState<any>(undefined);

  useEffect(() => {
    AuthState.getUser();
    AuthState.getLobbies(setLobbies);
  }, []);

  return (
    <div>
      <h1>{AuthState.auth_info?.display_name}</h1>
      <button
        onClick={() => {
          AuthState.logout();
        }}
      >
        Logout
      </button>
      <button
        onClick={() => {
          AuthState.createLobby((d: any) => {
            console.log(d);
          });
        }}
      >
        Create Lobby
      </button>
    </div>
  );
});

export default App;
