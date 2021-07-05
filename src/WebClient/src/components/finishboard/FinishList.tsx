import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import PopUpState from "../../state/PopUpState";
import LobbyState from "../../state/LobbyState";
import FinishRecord from "./FinishRecord";

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

const FinishList = observer(() => {
  return (
    <FinishWrapper>
      <InnerWrapper>
        {LobbyState.game?.gameHistories! != undefined ? (
          LobbyState.game?.gameHistories!.map((history, ind) => {
            const timeLeft = calculateTimeLeft(
              new Date(LobbyState.lobby?.startTime!),
              new Date(history.player.finishedTime)
            );
            return (
              <FinishRecord
                game={LobbyState.game!}
                timeLeft={timeLeft}
                history={history}
                ind={ind}
                finished={history.player.finished}
              ></FinishRecord>
            );
          })
        ) : (
          <></>
        )}
      </InnerWrapper>
    </FinishWrapper>
  );
});

export default FinishList;
