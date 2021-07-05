import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import TimerState from "../../state/TimerState";
import LobbyState from "../../state/LobbyState";
import { Spinner } from "@fluentui/react/lib/Spinner";
import { Text, ITextProps } from "@fluentui/react/lib/Text";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 16px;
`;

const TimerContainer = styled.div`
  display: flex;
  justify-content: center;
  font-size: 4em;
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
          <Text variant="xLarge">
            Starting in{" "}
            <CountDownSeconds>{TimerState.timeLeft?.seconds}</CountDownSeconds>
          </Text>
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
        <Text variant="xLarge">
          Time Left: {TimerState.timeLeft?.minutes}
          {":"}
          {TimerState.timeLeft?.seconds! < 10
            ? "0" + TimerState.timeLeft?.seconds!
            : TimerState.timeLeft?.seconds!}
        </Text>
      </TimerContainer>
      {LobbyState.lobby?.startArticle != undefined ? (
        <DefaultButton
          onClick={() => {
            LobbyState.backToStart();
          }}
        >
          Reset Back To Start
        </DefaultButton>
      ) : (
        <></>
      )}
    </Layout>
  );
});

export default LobbyTimer;
