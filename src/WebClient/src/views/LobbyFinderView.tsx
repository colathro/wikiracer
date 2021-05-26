import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import AuthState from "../state/AuthState";
import LobbyState from "../state/LobbyState";

const LobbyFinderView = observer(() => {
  const [lobbies, setLobbies] = useState<any>([]);
  let history = useHistory();

  useEffect(() => {
    AuthState.getUser();
    LobbyState.getLobbies(setLobbies);
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          LobbyState.createLobby((d: any) => {
            history.push("/lobby");
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
                    LobbyState.joinLobby(lobby.key, () => {
                      history.push("/lobby");
                    });
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

export default LobbyFinderView;
