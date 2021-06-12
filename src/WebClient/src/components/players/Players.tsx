import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";
import { AuthType } from "../../enums/AuthType";

const Layout = styled.div`
  display: flex;
  height: 20em;
  border: 1px solid ${ThemeManager.theme?.text};
`;

const Wrapper = styled.div`
  margin: 0.5em;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const PlayersWrapper = styled.div`
  border: 1px solid ${ThemeManager.theme?.text};
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
`;

const PlayerWrapper = styled.div`
  display: flex;
  margin: 0.5em;
  justify-content: space-between;
  &:hover {
    text-decoration: underline;
  }
`;

const UserIconWrapper = styled.span`
  vertical-align: middle;
`;

const CurrentArticle = styled.span`
  color: ${ThemeManager.theme?.text3};
`;

const UserIcon = styled.img`
  height: 0.9em;
  margin-right: 0.3em;
`;

const Ban = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Players = observer(() => {
  const ban = (playerId: string) => {
    LobbyState.banPlayer(playerId, () => {});
  };

  return (
    <Layout>
      <Wrapper>
        <PlayersWrapper>
          {LobbyState.lobby?.players.map((player, key) => {
            if (player.active) {
              return (
                <PlayerWrapper key={key}>
                  <span>
                    {player.authProvider === AuthType.Twitch ? (
                      <UserIconWrapper>
                        <UserIcon
                          src={"/images/TwitchGlitchPurple.svg"}
                        ></UserIcon>
                      </UserIconWrapper>
                    ) : (
                      <></>
                    )}
                    {player.displayName}
                  </span>
                  <CurrentArticle>{player.currentArticle}</CurrentArticle>
                  {LobbyState.checkOwner() ? (
                    <Ban
                      onClick={() => {
                        ban(player.id);
                      }}
                    >
                      Ban
                    </Ban>
                  ) : (
                    <></>
                  )}
                </PlayerWrapper>
              );
            }
          })}
        </PlayersWrapper>
      </Wrapper>
    </Layout>
  );
});

export default Players;
