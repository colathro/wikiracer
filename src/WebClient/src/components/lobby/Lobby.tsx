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
import LobbyVisibility from "./LobbyVisibility";

const LobbyWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const ArticleWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
`;

const MenuWrapper = styled.div`
  width: 25em;
  display: flex;
  border-left: 1px solid ${ThemeManager.theme?.text};
`;

const Menu = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: space-around;
  justify-content: space-between;
  margin: 1em;
`;

const OwnerMenu = styled.div`
  display: flex;
  flex-direction: column;
`;

const Lobby = observer(() => {
  return (
    <LobbyWrapper>
      <ArticleWrapper>
        <Article />
      </ArticleWrapper>
      <MenuWrapper>
        <Menu>
          <LobbyTitle />
          {LobbyState.checkOwner() ? (
            <OwnerMenu>
              <LobbyVisibility />
              <TargetArticles />
            </OwnerMenu>
          ) : (
            <></>
          )}
          <Players />
          <Chat />
        </Menu>
      </MenuWrapper>
    </LobbyWrapper>
  );
});

export default Lobby;
