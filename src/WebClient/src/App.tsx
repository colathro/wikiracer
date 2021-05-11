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
  const [article, setArticle] = useState("a");
  const [articleData, setArticleData] = useState<any>(undefined);

  useEffect(() => {
    AuthState.getUser();
    AuthState.getArticle(article, setArticleData);
  }, []);

  console.log(articleData);

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
      <div>
        <button
          onClick={() => {
            AuthState.getArticle(article, setArticleData);
          }}
        >
          Load Article
        </button>
        {articleData != undefined ? (
          <div>
            <h1>{articleData!.title}</h1>
            {articleData!.paragraphs.map((paragraph: any, ind: any) => (
              <p key={ind}>
                {paragraph.spans.map((span: any, sind: any) => {
                  if (span.link != null) {
                    return (
                      <a
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          textDecoration: "underline",
                        }}
                        key={sind}
                        onClick={() => {
                          AuthState.getArticle(span.link, setArticleData);
                        }}
                      >
                        {span.text}
                      </a>
                    );
                  }
                  return <span key={sind}>{span.text}</span>;
                })}
              </p>
            ))}
          </div>
        ) : (
          <div>not loaded</div>
        )}
      </div>
    </div>
  );
});

export default App;
