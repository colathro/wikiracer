import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import LobbyState from "../state/LobbyState";
import ConnectionState from "../state/ConnectionState";
import Chat from "../components/chat/Chat";

const LobbyView = observer(() => {
  const [connectionStarted, setConnectionStarted] = useState(false);

  useEffect(() => {
    ConnectionState.start(() => {
      setConnectionStarted(true);
    });
  }, []);

  if (!connectionStarted) {
    return <h1>Loading...</h1>;
  }

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
      <div>
        <div>
          Players:
          <div>
            <ul>
              {LobbyState.lobby?.players.map((player, key) => {
                return <li key={key}>{player.displayName}</li>;
              })}
            </ul>
          </div>
        </div>
        <Chat />
        <div>
          Lobby Visibility: {LobbyState.lobby?.isPublic ? "Public" : "Private"}
        </div>
        <button
          onClick={() => {
            LobbyState.setPublic(() => {});
          }}
        >
          Toggle Public
        </button>
      </div>
    </div>
  );
});

export default LobbyView;
