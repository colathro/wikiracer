import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import AuthState from "./state/AuthState";
import GameState from "./state/GameState";
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
    if (document.location.toString().includes("login")) {
      AuthState.signin();
    }
    fetch("/api/sample")
      .then((response) => response.json())
      .then((data) => setArticles(data));
  }, []);

  const refresh = () => {
    fetch("/api/sample", {
      headers: {
        Authorization: "Bearer " + AuthState.user.id_token,
      },
    })
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
      <button onClick={GameState.send}>Send Message</button>
      <div>
        {GameState.messages.map((val, ind) => {
          return <div key={ind}>{val}</div>;
        })}
      </div>
      <div>
        <button onClick={AuthState.login}>Login</button>
        <button onClick={AuthState.logout}>Logout</button>
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
