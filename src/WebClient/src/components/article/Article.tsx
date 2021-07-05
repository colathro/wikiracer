import React, { useState, useEffect, useRef, createRef } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import Lobby from "../lobby/Lobby";
import SharedReferences from "../../state/SharedReferences";
import ArticleTitle from "./ArticleTitle";
import ArticleSpan from "./ArticleSpan";
import ArticleHeader from "./ArticleHeader";
import ArticleLink from "./ArticleLink";
import ArticleImage from "./ArticleImage";
import ArticleNotLoaded from "./ArticleNotLoaded";

const ArticleWrapper = styled.div`
  overflow-y: scroll;
  padding-right: 4em;
`;

const ArticleInner = styled.div`
  margin: 1.5em;
  margin-top: 0.5em;
`;

const Paragraph = styled.p`
  font-family: sans-serif;
  font: Arial;
  font-size: 14px;
  line-height: 22.5px;
`;

const Article = observer(() => {
  const currentArticle = useRef("");
  const scrollRef = createRef<HTMLDivElement>();
  const [articleData, setArticleData] = useState<any>(undefined);

  if (SharedReferences.articleHook != setArticleData) {
    SharedReferences.articleHook = setArticleData;
  }
  if (SharedReferences.articleRef != currentArticle) {
    SharedReferences.articleRef = currentArticle;
  }
  if (SharedReferences.scrollRef != scrollRef) {
    SharedReferences.scrollRef = scrollRef;
  }

  return (
    <ArticleWrapper ref={scrollRef}>
      {articleData != undefined ? (
        <ArticleInner>
          <ArticleTitle title={articleData!.title}></ArticleTitle>
          {articleData!.paragraphs.map((paragraph: any, ind: any) => {
            if (paragraph.level === 0) {
              if (paragraph.spans[0]?.type! === 2) {
                return <ArticleImage span={paragraph.spans[0]}></ArticleImage>;
              }
              return (
                <Paragraph key={ind}>
                  {paragraph.spans.map((span: any, sind: any) => {
                    if (span.link != null) {
                      return (
                        <ArticleLink
                          key={sind}
                          span={span}
                          click={() => {
                            LobbyState.getArticle(span.link, (data: any) => {
                              currentArticle.current = span.link;
                              setArticleData(data);
                            });
                          }}
                        ></ArticleLink>
                      );
                    }
                    return <ArticleSpan key={sind} span={span}></ArticleSpan>;
                  })}
                </Paragraph>
              );
            }
            if (paragraph.level >= 1) {
              return <ArticleHeader paragraph={paragraph}></ArticleHeader>;
            }
          })}
        </ArticleInner>
      ) : (
        <ArticleNotLoaded />
      )}
    </ArticleWrapper>
  );
});

export default Article;
