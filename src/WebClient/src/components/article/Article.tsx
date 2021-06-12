import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import Lobby from "../lobby/Lobby";

const ArticleWrapper = styled.div`
  overflow-y: scroll;
`;

const Article = observer(() => {
  const currentArticle = useRef("");
  const [articleData, setArticleData] = useState<any>(undefined);

  useEffect(() => {
    LobbyState.articleHook = setArticleData;
    LobbyState.articleRef = currentArticle;
  }, []);

  return (
    <ArticleWrapper>
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
                            LobbyState.getArticle(span.link, (data: any) => {
                              currentArticle.current = span.link;
                              setArticleData(data);
                            });
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
    </ArticleWrapper>
  );
});

export default Article;
