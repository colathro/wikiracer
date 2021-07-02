import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import TimerState from "../../state/TimerState";
import LobbyState from "../../state/LobbyState";
import { Spinner } from "@fluentui/react/lib/Spinner";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimerContainer = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 4em;
  user-select: none;
`;

const WaitingContainer = styled.span`
  display: flex;
  justify-content: space-around;
  font-size: 3em;
  user-select: none;
`;

const CountDownContainer = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 5em;
  user-select: none;
`;

const Toggle = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const CountDownSeconds = styled.span``;

const LobbyTimer = observer(() => {
  if (TimerState.timeLeft?.countDown) {
    return (
      <Layout>
        <TimerContainer>
          Starting in
          <CountDownSeconds>{TimerState.timeLeft?.seconds}</CountDownSeconds>
        </TimerContainer>
      </Layout>
    );
  }

  if (!LobbyState.isStarted() && !LobbyState.isStarting()) {
    return (
      <Layout>
        <Spinner label="Waiting for host to start game..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <TimerContainer>
        {TimerState.timeLeft?.minutes}
        {":"}
        {TimerState.timeLeft?.seconds! < 10
          ? "0" + TimerState.timeLeft?.seconds!
          : TimerState.timeLeft?.seconds!}
      </TimerContainer>
      {LobbyState.lobby?.startArticle != undefined ? (
        <Toggle
          onClick={() => {
            LobbyState.backToStart();
          }}
        >
          Reset Back To {LobbyState.lobby?.startArticle!}
        </Toggle>
      ) : (
        <></>
      )}
    </Layout>
  );
});

export default LobbyTimer;
