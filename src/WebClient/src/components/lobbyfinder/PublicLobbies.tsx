import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import AuthState from "../../state/AuthState";
import { useHistory } from "react-router-dom";

const Layout = styled.div`
  display: flex;
`;

const Anchor = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const PublicLobbies = observer(() => {
  const [lobbies, setLobbies] = useState<any>([]);
  useEffect(() => {
    AuthState.getUser();
    LobbyState.getLobbies(setLobbies);
  }, []);
  let history = useHistory();
  return (
    <Layout>
      <ul>
        {lobbies.map((lobby: any, key: any) => {
          return (
            <li key={key}>
              {lobby.key} {lobby.owner.displayName}{" "}
              <button
                onClick={() => {
                  LobbyState.joinLobby(lobby.key, () => {
                    history.push("/lobby");
                  });
                }}
              >
                Join
              </button>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
});

export default PublicLobbies;
