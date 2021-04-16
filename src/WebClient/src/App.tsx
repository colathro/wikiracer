import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import LobbyManager from "./state/Lobby";
import "./App.css";

function App() {
  return (
    <div>
      <TestComponent></TestComponent>
    </div>
  );
}

const TestComponent = observer(() => {
  return (
    <div>
      <button onClick={LobbyManager.send}>Send Message</button>
      <div>
        {LobbyManager.messages.map((val, ind) => {
          return <div key={ind}>{val}</div>;
        })}
      </div>
    </div>
  );
});

export default App;
