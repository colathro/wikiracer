import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import PopUpState from "../../state/PopUpState";
import LobbyState from "../../state/LobbyState";

const calculateTimeLeft = (start: Date, end: Date) => {
  let difference = +end - +start;

  const timeLeft = {
    countDown: false,
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    milliseconds: Math.floor(difference % 1000),
  };

  return timeLeft;
};

const FinishWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-top: 1em;
  margin-bottom: 1em;
  border: 1px solid ${ThemeManager.theme?.text};
  overflow-y: scroll;
`;

const InnerWrapper = styled.div`
  margin: 1em;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const FinishRecord = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const User = styled.span``;

const FinishTime = styled.span``;

const FinishList = observer(() => {
  const gameHistories = LobbyState.game?.gameHistories;
  return (
    <FinishWrapper>
      <InnerWrapper>
        {gameHistories!.map((history) => {
          const timeLeft = calculateTimeLeft(
            new Date(LobbyState.lobby?.startTime!),
            new Date(history.player.finishedTime)
          );
          return (
            <FinishRecord>
              <User>{history.player.displayName}</User>
              <FinishTime>
                Finished in: {timeLeft.minutes}:{timeLeft.seconds}.
                {timeLeft.milliseconds}
              </FinishTime>
            </FinishRecord>
          );
        })}
      </InnerWrapper>
    </FinishWrapper>
  );
});

export default FinishList;
