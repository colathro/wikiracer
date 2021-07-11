import { useState, useEffect } from "react";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import { useHistory } from "react-router-dom";
import { Lobby, PublicLobbyResponse } from "../../types/Lobby";
import {
  PrimaryButton,
  DefaultButton,
  Icon,
  Text,
  Spinner,
  IconButton,
  IIconProps,
} from "@fluentui/react";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  height: 500px;
  overflow-y: scroll;
`;

const PagesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1em;
  margin-top: 3em;
`;

const LobbyWrapper = styled.div`
  display: flex;
  margin: 1em;
  justify-content: space-between;
`;

const LoaderWrapper = styled.div`
  display: flex;
  margin: 1em;
  align-items: center;
  justify-content: center;
  height: 500px;
`;

const Owner = styled.div``;

const Players = styled.div`
  display: flex;
`;

const PlayersText = styled.div`
  margin-right: 1em;
`;

const NoLobbies = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const refreshIcon: IIconProps = { iconName: "Refresh" };

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
  if (pbr === undefined) {
    return (
      <Layout>
        <IconButton
          onClick={() => {
            setLobbies(undefined);
            setTimeout(() => {
              LobbyState.getLobbies(setLobbies, 0);
            }, 500);
          }}
          iconProps={refreshIcon}
        >
          Refresh
        </IconButton>
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
      <IconButton
        onClick={() => {
          setLobbies(undefined);
          setTimeout(() => {
            LobbyState.getLobbies(setLobbies, 0);
          }, 500);
        }}
        iconProps={refreshIcon}
      >
        Refresh
      </IconButton>
      <List>
        {pbr?.lobbies.length > 0 ? (
          pbr?.lobbies.map((lobby: Lobby, key: any) => {
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
                <PrimaryButton
                  onClick={() => {
                    LobbyState.joinLobby(lobby.key, () => {
                      history.push("/lobby");
                    });
                  }}
                >
                  Join
                </PrimaryButton>
              </LobbyWrapper>
            );
          })
        ) : (
          <NoLobbies>
            <Text variant="medium">
              There are no public lobbies. Try creating one above!
            </Text>
          </NoLobbies>
        )}
      </List>
      <PagesWrapper>
        <Text>
          <PrimaryButton
            onClick={() => {
              gotoPage(page - 1);
            }}
            disabled={page === 0}
          >
            Previous
          </PrimaryButton>
        </Text>
        {page === 0
          ? runCallback(() => {
              const row = [];
              const top = Math.min(page + 4, pbr?.pages!);
              for (var i = 0; i <= top; i++) {
                const p = i;
                if (i === page) {
                  row.push(
                    <Text key={i}>
                      <DefaultButton disabled>{i}</DefaultButton>
                    </Text>
                  );
                } else {
                  row.push(
                    <Text key={i}>
                      <DefaultButton
                        onClick={() => {
                          gotoPage(p);
                        }}
                      >
                        {i}
                      </DefaultButton>
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
                  row.push(<DefaultButton disabled>{i}</DefaultButton>);
                } else {
                  row.push(
                    <DefaultButton
                      onClick={() => {
                        gotoPage(p);
                      }}
                    >
                      {i}
                    </DefaultButton>
                  );
                }
              }
              return row;
            })}
        <Text>
          <PrimaryButton
            onClick={() => {
              gotoPage(page + 1);
            }}
            disabled={page === pbr?.pages!}
          >
            Next
          </PrimaryButton>
        </Text>
      </PagesWrapper>
    </Layout>
  );
});

export default PublicLobbies;
