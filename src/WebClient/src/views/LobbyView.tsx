import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import LobbyState from "../state/LobbyState";
import ConnectionState from "../state/ConnectionState";
import Chat from "../components/chat/Chat";
import Players from "../components/players/Players";
import Article from "../components/article/Article";
import TargetArticles from "../components/TargetArticles";

const LobbyView = observer(() => {
  const [connectionStarted, setConnectionStarted] = useState(false);
  let history = useHistory();

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

  return (
    <div>
      <div>{LobbyState.lobby!.key}</div>
      <button
        onClick={() => {
          LobbyState.leaveLobby();
          history.push("/");
        }}
      >
        Leave Lobby
      </button>
      <div>
        <Players />
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
        <TargetArticles />
      </div>
      <div>
        <Article />
      </div>
    </div>
  );
});

export default LobbyView;
