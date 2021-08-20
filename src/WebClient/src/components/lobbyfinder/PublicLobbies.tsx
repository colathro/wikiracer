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
  TooltipHost,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import Player from "../players/Player";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  box-shadow: rgb(0 0 0 / 13%) 0px 3.2px 7.2px 0px,
    rgb(0 0 0 / 11%) 0px 0.6px 1.8px 0px;
  outline: transparent;
  border-radius: 4px;
`;

const LobbyInner = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  margin: 0.5em;
  margin-left: 2em;
  margin-right: 2em;
`;

const LoaderWrapper = styled.div`
  display: flex;
  margin: 1em;
  align-items: center;
  justify-content: center;
  height: 500px;
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

  const tooltipId = useId("tooltip");

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
                <LobbyInner>
                  <Player player={lobby.owner} />
                  <div>
                    <Text variant="tiny" nowrap style={{ maxWidth: "8em" }}>
                      <TooltipHost
                        content={lobby.startArticle}
                        // This id is used on the tooltip itself, not the host
                        // (so an element with this id only exists when the tooltip is shown)
                        id={tooltipId}
                      >
                        <Text variant="tiny" nowrap>
                          Start: {lobby.startArticle}
                        </Text>
                      </TooltipHost>
                    </Text>{" "}
                    <Text variant="tiny" nowrap style={{ maxWidth: "8em" }}>
                      <TooltipHost
                        content={lobby.endArticle}
                        // This id is used on the tooltip itself, not the host
                        // (so an element with this id only exists when the tooltip is shown)
                        id={tooltipId}
                      >
                        <Text variant="tiny" nowrap>
                          Finish: {lobby.endArticle}
                        </Text>
                      </TooltipHost>
                    </Text>
                  </div>
                  <Text>
                    {
                      lobby.players.filter((val) => {
                        return val.active === true;
                      }).length
                    }
                    {"/10 Players"}
                  </Text>
                  <PrimaryButton
                    onClick={() => {
                      LobbyState.joinLobby(lobby.key, () => {
                        history.push("/lobby");
                      });
                    }}
                  >
                    Join
                  </PrimaryButton>
                </LobbyInner>
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
