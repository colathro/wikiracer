import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import AuthState from "../../state/AuthState";
import { useHistory } from "react-router-dom";
import { Lobby, PublicLobbyResponse } from "../../types/Lobby";
import { PrimaryButton, Icon, Text, Link, Spinner } from "@fluentui/react";

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

const AnchorInactive = styled.span`
  color: ${ThemeManager.theme?.text};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 500px;
`;

const PagesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1em;
  margin-top: 3em;
  width: 500px;
`;

const LobbyWrapper = styled.div`
  display: flex;
  margin: 1em;
  justify-content: space-between;
  width: 500px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  margin: 1em;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 500px;
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
    LobbyState.getLobbies(setLobbies, 0);
  }, []);
  if (pbr == undefined) {
    return (
      <Layout>
        <List>
          <LoaderWrapper>
            <Spinner label="Loading public lobbies..." />
          </LoaderWrapper>
        </List>
      </Layout>
    );
  }

  return (
    <Layout>
      <Owner>
        <PrimaryButton
          onClick={() => {
            setLobbies(undefined);
            setTimeout(() => {
              LobbyState.getLobbies(setLobbies, 0);
            }, 500);
          }}
        >
          Refresh
        </PrimaryButton>
      </Owner>
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
                <Icon iconName="People" />
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
        <Text>
          <Link
            onClick={() => {
              gotoPage(page - 1);
            }}
          >
            {page === 0 ? "" : "Previous"}
          </Link>
        </Text>
        {page === 0
          ? runCallback(() => {
              const row = [];
              const top = Math.min(page + 4, pbr?.pages!);
              for (var i = 0; i <= top; i++) {
                const p = i;
                if (i === page) {
                  row.push(
                    <Text>
                      <AnchorInactive key={i}>{i}</AnchorInactive>
                    </Text>
                  );
                } else {
                  row.push(
                    <Text>
                      <Anchor
                        onClick={() => {
                          gotoPage(p);
                        }}
                        key={i}
                      >
                        {i}
                      </Anchor>
                    </Text>
                  );
                }
              }
              return row;
            })
          : runCallback(() => {
              const row = [];
              const bot = page - 1;
              const top = Math.min(page + 4, pbr?.pages!);
              for (var i = bot; i <= top; i++) {
                const p = i;
                if (i === page) {
                  row.push(
                    <Text>
                      <AnchorInactive key={i}>{i}</AnchorInactive>
                    </Text>
                  );
                } else {
                  row.push(
                    <Text>
                      <Anchor
                        onClick={() => {
                          gotoPage(p);
                        }}
                        key={i}
                      >
                        {i}
                      </Anchor>
                    </Text>
                  );
                }
              }
              return row;
            })}
        <Text>
          <Anchor
            onClick={() => {
              gotoPage(page + 1);
            }}
          >
            {page === pbr?.pages! ? "" : "Next"}
          </Anchor>
        </Text>
      </PagesWrapper>
    </Layout>
  );
});

export default PublicLobbies;
