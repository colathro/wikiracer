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
    fetch(`/api/sample?title=${title}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AuthState.user.id_token,
      },
    }).then((response) => response.json());
  };

  const del = (name: string) => {
    fetch(`/api/sample?title=${name}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + AuthState.user.id_token,
      },
    }).then((response) => response.json());
  };

  const change = (ev: any) => {
    setTitle(ev.target.value);
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
      <button onClick={GameState.send}>Send Message</button>
      <div>
        {GameState.messages.map((val, ind) => {
          return <div key={ind}>{val}</div>;
        })}
      </div>
      <h1>{AuthState.user?.profile?.preferred_username}</h1>
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
              {val.title}
              <button
                onClick={() => {
                  del(val.title);
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
