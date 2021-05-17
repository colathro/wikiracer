import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";

const Chat = observer(() => {
  const [message, setMessage] = useState("");

  const send = () => {
    LobbyState.sendMessage(message, () => {});
    setMessage("");
  };

  return (
    <div>
      <div>
        Chat:
        <div>
          <ul>
            {LobbyState.lobby?.messages.map((message, key) => {
              return (
                <li key={key}>
                  {message.author.displayName}: {message.text}
                </li>
              );
            })}
          </ul>
          <input
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
          ></input>
          <button
            onClick={() => {
              send();
            }}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
});

export default Chat;
