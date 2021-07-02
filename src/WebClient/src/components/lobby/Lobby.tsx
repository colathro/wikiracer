import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";
import Chat from "../chat/Chat";
import Players from "../players/Players";
import Article from "../article/Article";
import TargetArticles from "./TargetArticles";
import LobbyTitle from "./LobbyTitle";
import LobbyTimer from "./LobbyTimer";
import LobbyVisibility from "./LobbyVisibility";
import LobbyControls from "./LobbyControls";
import Finish from "../popups/Finish";

const LobbyWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const ArticleWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 20em;
  align-content: center;
  height: 100vh;
`;

const MenuWrapper = styled.div`
  width: 16em;
  max-width: 16em;
  display: flex;
  flex: 1;
  position: fixed;
  height: 100vh;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1em;
  max-width: 16em;
  justify-content: space-between;
`;

const OwnerMenu = styled.div`
  display: flex;
  flex-direction: column;
`;

const Lobby = observer(() => {
  return (
    <LobbyWrapper>
      <Finish />
      <MenuWrapper>
        <Menu>
          <LobbyTitle />
          <LobbyTimer />
          {LobbyState.checkOwner() ? (
            <OwnerMenu>
              <LobbyVisibility />
              <TargetArticles owner={true} />
              <LobbyControls />
            </OwnerMenu>
          ) : (
            <OwnerMenu>
              <TargetArticles owner={false} />
            </OwnerMenu>
          )}
          <Players />
          <Chat />
        </Menu>
      </MenuWrapper>
      <ArticleWrapper>
        <Article />
      </ArticleWrapper>
    </LobbyWrapper>
  );
});

export default Lobby;
