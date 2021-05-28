import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import AuthState from "../../state/AuthState";
import LobbyState from "../../state/LobbyState";
import CreateLobby from "./CreateLobby";
import PublicLobbies from "./PublicLobbies";
import JoinLobby from "./JoinLobby";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.h1`
  font-weight: normal;
  font-size: 3em;
  max-width: 50%;
  border-bottom: 0.5px solid ${ThemeManager.theme?.text};
`;

const LobbyFinder = observer(() => {
  return (
    <Layout>
      <Container>
        <Header>Join a Lobby</Header>
        <JoinLobby />
      </Container>
      <Container>
        <Header>Create a Lobby</Header>
        <CreateLobby />
      </Container>
      <Container>
        <Header>Public Lobbies</Header>
        <PublicLobbies />
      </Container>
    </Layout>
  );
});

export default LobbyFinder;
