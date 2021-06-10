import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";

import Logo from "../nav/Logo";
import TimerState from "../../state/TimerState";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const LogoContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  width: 20em;
  height: 15em;
`;

const Leave = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const LobbyKey = observer(() => {
  return <div>Join Code: {LobbyState.lobby!.key}</div>;
});

const LobbyTitle = observer(() => {
  let history = useHistory();

  return (
    <Layout>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      {TimerState.timeLeft?.minutes}
      {":"}
      {TimerState.timeLeft?.seconds}
      <ButtonContainer>
        <LobbyKey />
        <Leave
          onClick={() => {
            LobbyState.leaveLobby();
            history.push("/");
          }}
        >
          Leave Lobby
        </Leave>
      </ButtonContainer>
    </Layout>
  );
});

export default LobbyTitle;
