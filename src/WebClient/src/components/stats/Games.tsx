import { useState, useEffect } from "react";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import { Game, GameResponse } from "../../types/Lobby";
import { PrimaryButton, Text, Spinner } from "@fluentui/react";
import AuthState from "../../state/AuthState";
import GameStats from "./GameStats";

const Layout = styled.div`
  display: flex;
  flex: 1;
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
`;

const Games = observer(() => {
  const [games, setGames] = useState<GameResponse>();
  const [page, setPage] = useState<number>(0);

  const runCallback = (cb: any) => {
    return cb();
  };

  const setGamesAndPage = (gameResponse: GameResponse, pageNum: number) => {
    setGames(gameResponse);
    setPage(pageNum);
  };

  const gotoPage = (pageNum: number) => {
    AuthState.getGames((gameResponse: GameResponse) => {
      setGamesAndPage(gameResponse, pageNum);
    }, pageNum);
  };

  useEffect(() => {
    AuthState.getGames(setGames);
  }, []);

  if (games === undefined) {
    return (
      <Layout>
        <List>
          <LoaderWrapper>
            <Spinner label="Loading your games..." />
          </LoaderWrapper>
        </List>
      </Layout>
    );
  }

  return (
    <Layout>
      <List>
        {games?.games.map((game: Game, key: any) => {
          return (
            <LobbyWrapper key={key}>
              <GameStats game={game}></GameStats>
            </LobbyWrapper>
          );
        })}
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
              const top = Math.min(page + 4, games?.pages!);
              for (var i = 0; i <= top; i++) {
                const p = i;
                if (i === page) {
                  row.push(
                    <Text key={i}>
                      <AnchorInactive>{i}</AnchorInactive>
                    </Text>
                  );
                } else {
                  row.push(
                    <Text key={i}>
                      <Anchor
                        onClick={() => {
                          gotoPage(p);
                        }}
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
              const top = Math.min(page + 4, games?.pages!);
              for (var i = bot; i <= top; i++) {
                const p = i;
                if (i === page) {
                  row.push(
                    <Text key={i}>
                      <AnchorInactive>{i}</AnchorInactive>
                    </Text>
                  );
                } else {
                  row.push(
                    <Text key={i}>
                      <Anchor
                        onClick={() => {
                          gotoPage(p);
                        }}
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
          <PrimaryButton
            onClick={() => {
              gotoPage(page + 1);
            }}
            disabled={page === games?.pages!}
          >
            Next
          </PrimaryButton>
        </Text>
      </PagesWrapper>
    </Layout>
  );
});

export default Games;
