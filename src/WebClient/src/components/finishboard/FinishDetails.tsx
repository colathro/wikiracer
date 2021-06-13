import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import PopUpState from "../../state/PopUpState";
import LobbyState from "../../state/LobbyState";
import { GameHistory, GameNavigation } from "../../types/Lobby";

const FinishRecordDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0.5em;
`;

const ArticleName = styled.div``;

const TimeSpent = styled.div``;

type props = {
  navigations: GameNavigation[];
  finished: boolean;
  finishTime: Date;
  startTime: Date;
  endTime: Date;
  open: boolean;
};

type CalculatedNavigation = {
  article: string;
  timeOnArticleMs: number;
};

const generateTimeOffsets = (diff: number) => {
  const timeLeft = {
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    milliseconds: Math.floor(diff % 1000),
  };

  return timeLeft;
};

const calculateDeltaMs = (start: Date, end: Date) => {
  return +end - +start;
};

const generateTraversalHistory = (
  navigations: GameNavigation[],
  finished: boolean,
  finishTime: Date,
  startTime: Date,
  endTime: Date
) => {
  const calculatedNavigations: CalculatedNavigation[] = [];
  for (let index = 0; index < navigations.length; index++) {
    const curArticle = navigations[index];

    if (index === 0) {
      if (index < navigations.length - 1) {
        console.log(startTime);
        const nextArticle = navigations[index + 1];
        calculatedNavigations.push({
          article: curArticle.article,
          timeOnArticleMs: calculateDeltaMs(
            new Date(startTime),
            new Date(nextArticle.timestamp)
          ),
        });
      } else {
        calculatedNavigations.push({
          article: curArticle.article,
          timeOnArticleMs: calculateDeltaMs(
            new Date(startTime),
            new Date(endTime)
          ),
        });
      }
    } else if (index < navigations.length - 1) {
      // index isn't the last
      const nextArticle = navigations[index + 1];
      calculatedNavigations.push({
        article: curArticle.article,
        timeOnArticleMs: calculateDeltaMs(
          new Date(curArticle.timestamp),
          new Date(nextArticle.timestamp)
        ),
      });
    } else {
      if (finished) {
        calculatedNavigations.push({
          article: curArticle.article,
          timeOnArticleMs: calculateDeltaMs(
            new Date(curArticle.timestamp),
            new Date(finishTime)
          ),
        });
      } else {
        calculatedNavigations.push({
          article: curArticle.article,
          timeOnArticleMs: 0,
        });
      }
    }
  }
  return calculatedNavigations;
};

const FinishDetails = observer((props: props) => {
  const calcNavs: CalculatedNavigation[] = generateTraversalHistory(
    props.navigations,
    props.finished,
    props.finishTime,
    props.startTime,
    props.endTime
  );
  return props.open ? (
    <FinishRecordDetailsWrapper>
      {calcNavs.map((nav, ind) => {
        const timeLeft = generateTimeOffsets(nav.timeOnArticleMs);
        return (
          <Navigation key={ind}>
            <ArticleName>{nav.article}</ArticleName>
            <TimeSpent>
              {timeLeft.minutes}:{timeLeft.seconds}.{timeLeft.milliseconds}
            </TimeSpent>
          </Navigation>
        );
      })}
    </FinishRecordDetailsWrapper>
  ) : (
    <></>
  );
});

export default FinishDetails;
