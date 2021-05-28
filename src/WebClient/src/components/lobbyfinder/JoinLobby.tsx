import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import { useHistory } from "react-router-dom";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Anchor = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Input = styled.input`
  margin-right: 1em;
`;

const JoinLobby = observer(() => {
  let history = useHistory();
  const [joinKey, setJoinKey] = useState("");
  return (
    <Layout>
      <div>Invite Code:</div>
      <div>
        <Input
          onChange={(e) => {
            setJoinKey(e.target.value);
          }}
          value={joinKey}
        ></Input>
        <Anchor
          onClick={() => {
            LobbyState.joinLobby(joinKey, (d: any) => {
              history.push("/lobby");
            });
          }}
        >
          Join Lobby
        </Anchor>
      </div>
    </Layout>
  );
});

export default JoinLobby;
