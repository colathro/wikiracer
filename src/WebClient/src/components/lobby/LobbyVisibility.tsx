import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";

const Layout = styled.div`
  display: flex;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const Toggle = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const LobbyVisibility = observer(() => {
  return (
    <Layout>
      <Toggle
        onClick={() => {
          LobbyState.setPublic(() => {});
        }}
      >
        {LobbyState.lobby?.isPublic
          ? "Make Lobby Private"
          : "Make Lobby Public"}
      </Toggle>
    </Layout>
  );
});

export default LobbyVisibility;
