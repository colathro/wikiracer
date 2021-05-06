import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import AuthState from "./state/AuthState";
import GameState from "./state/LobbyState";
import "./App.css";

function App() {
  return (
    <div>
      <TestComponent></TestComponent>
    </div>
  );
}

const TestComponent = observer(() => {
  const refresh = () => {
    AuthState.getUser();
  };

  useEffect(() => {
    if (document.location.toString().includes("login")) {
      AuthState.signin();
    }
    if (AuthState.user) {
      refresh();
    }
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            AuthState.login();
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            AuthState.logout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
});

export default App;
