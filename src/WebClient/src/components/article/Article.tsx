import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import AuthState from "../../state/AuthState";
import LobbyState from "../../state/LobbyState";

const Article = observer(() => {
  const [article, setArticle] = useState("Shia Islam");
  const [useStorageAccount, setUseStorageAccount] = useState(false);
  const [articleData, setArticleData] = useState<any>(undefined);

  useEffect(() => {
    AuthState.getUser();
    LobbyState.getArticle(article, useStorageAccount, setArticleData);
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
        Arrticle Method: {useStorageAccount ? "Storage" : "API"}
        <button
          onClick={() => {
            setUseStorageAccount(!useStorageAccount);
          }}
        >
          Toggle
        </button>
        <button
          onClick={() => {
            LobbyState.getArticle(article, useStorageAccount, setArticleData);
          }}
        >
          Load Article
        </button>
        {articleData != undefined ? (
          <div>
            <h1>{articleData!.title}</h1>
            {articleData!.paragraphs.map((paragraph: any, ind: any) => {
              if (paragraph.level === 0) {
                return (
                  <p key={ind}>
                    {paragraph.spans.map((span: any, sind: any) => {
                      if (span.type == 2) {
                        return (
                          <img src={`/api/image?imageurl=${span.link}`}></img>
                        );
                      }
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
                              LobbyState.getArticle(
                                span.link,
                                useStorageAccount,
                                setArticleData
                              );
                            }}
                          >
                            {span.text}
                          </a>
                        );
                      }
                      return <span key={sind}>{span.text}</span>;
                    })}
                  </p>
                );
              }
              if (paragraph.level >= 1) {
                return <h1>{paragraph.spans[0].text}</h1>;
              }
            })}
          </div>
        ) : (
          <div>not loaded</div>
        )}
      </div>
    </div>
  );
});

export default Article;
