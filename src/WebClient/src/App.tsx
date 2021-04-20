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
  const [articles, setArticles] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("/api/sample")
      .then((response) => response.json())
      .then((data) => setArticles(data));
  }, []);

  const refresh = () => {
    fetch("/api/sample")
      .then((response) => response.json())
      .then((data) => setArticles(data));
  };

  const add = () => {
    fetch(`/api/sample?title=${title}`, { method: "POST" }).then((response) =>
      response.json()
    );
  };

  const del = (name: string) => {
    fetch(`/api/sample?title=${name}`, {
      method: "DELETE",
    }).then((response) => response.json());
  };

  const change = (ev: any) => {
    setTitle(ev.target.value);
  };

  return (
    <div>
      <button onClick={LobbyManager.send}>Send Message</button>
      <div>
        {LobbyManager.messages.map((val, ind) => {
          return <div key={ind}>{val}</div>;
        })}
      </div>
      <div>
        <button onClick={add}>Add Article</button>
        <button onClick={refresh}>Refresh Articles</button>
      </div>
      <div>
        <input onChange={change}></input>
      </div>
      <div>
        {articles.map((val, ind) => {
          return (
            <div key={ind}>
              {val.key}
              <button
                onClick={() => {
                  del(val.key);
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default App;
