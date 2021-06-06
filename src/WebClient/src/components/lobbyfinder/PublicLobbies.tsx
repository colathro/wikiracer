import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import AuthState from "../../state/AuthState";
import { useHistory } from "react-router-dom";
import { Lobby, PublicLobbyResponse } from "../../types/Lobby";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Anchor = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const AnchorInactive = styled.span`
  color: ${ThemeManager.theme?.text};
  text-decoration: underline;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PagesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 50%;
  margin: 1em;
  margin-top: 3em;
`;

const LobbyWrapper = styled.div`
  display: flex;
  margin: 1em;
  justify-content: space-between;
  max-width: 50%;
`;

const Owner = styled.div``;

const Players = styled.div`
  display: flex;
`;

const PlayersText = styled.div`
  margin-right: 1em;
`;

const Player = styled.img``;

const PublicLobbies = observer(() => {
  let history = useHistory();
  const [pbr, setLobbies] = useState<PublicLobbyResponse>();
  const [page, setPage] = useState<number>(0);

  const runCallback = (cb: any) => {
    return cb();
  };

  const setLobbiesAndPage = (
    lobbyResp: PublicLobbyResponse,
    pageNum: number
  ) => {
    setLobbies(lobbyResp);
    setPage(pageNum);
  };

  const gotoPage = (pageNum: number) => {
    LobbyState.getLobbies((lobbyResp: PublicLobbyResponse) => {
      setLobbiesAndPage(lobbyResp, pageNum);
    }, pageNum);
  };

  useEffect(() => {
    AuthState.getUser();
    LobbyState.getLobbies(setLobbies, 0);
  }, []);
  return (
    <Layout>
      <List>
        {pbr?.lobbies.map((lobby: Lobby, key: any) => {
          return (
            <LobbyWrapper key={key}>
              <Owner>{lobby.owner.displayName}</Owner>
              <Players>
                <PlayersText>
                  {
                    lobby.players.filter((val) => {
                      return val.active === true;
                    }).length
                  }
                </PlayersText>
                <Player src={ThemeManager.theme?.player}></Player>
              </Players>
              <Anchor
                onClick={() => {
                  LobbyState.joinLobby(lobby.key, () => {
                    history.push("/lobby");
                  });
                }}
              >
                Join
              </Anchor>
            </LobbyWrapper>
          );
        })}
      </List>
      <PagesWrapper>
        <Anchor
          onClick={() => {
            gotoPage(page - 1);
          }}
        >
          {page === 0 ? "" : "Previous"}
        </Anchor>
        {page === 0
          ? runCallback(() => {
              const row = [];
              const top = Math.min(page + 4, pbr?.pages!);
              for (var i = 0; i <= top; i++) {
                const p = i;
                if (i === page) {
                  row.push(<AnchorInactive key={i}>{i}</AnchorInactive>);
                } else {
                  row.push(
                    <Anchor
                      onClick={() => {
                        gotoPage(p);
                      }}
                      key={i}
                    >
                      {i}
                    </Anchor>
                  );
                }
              }
              return row;
            })
          : runCallback(() => {
              const row = [];
              const bot = page - 1;
              const top = Math.min(page + 4, pbr?.pages!);
              for (var i = bot; i < top; i++) {
                const p = i;
                if (i === page) {
                  row.push(<AnchorInactive key={i}>{i}</AnchorInactive>);
                } else {
                  row.push(
                    <Anchor
                      onClick={() => {
                        gotoPage(p);
                      }}
                      key={i}
                    >
                      {i}
                    </Anchor>
                  );
                }
              }
              return row;
            })}
        <Anchor
          onClick={() => {
            gotoPage(page + 1);
          }}
        >
          {page === pbr?.pages! - 1 ? "" : "Next"}
        </Anchor>
      </PagesWrapper>
    </Layout>
  );
});

export default PublicLobbies;
