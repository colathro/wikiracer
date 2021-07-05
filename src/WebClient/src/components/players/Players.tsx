import { observer } from "mobx-react-lite";
import styled from "styled-components";
import LobbyState from "../../state/LobbyState";
import Player from "./Player";
import {
  Text,
  OverflowSet,
  IconButton,
  IOverflowSetItemProps,
  Link,
} from "@fluentui/react";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import { useId } from "@fluentui/react-hooks";

const Layout = styled.div`
  display: flex;
`;

const Wrapper = styled.div`
  margin: 0.5em;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const PlayersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PlayerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
  return (
    <Link role="menuitem" onClick={item.onClick}>
      {item.name}
    </Link>
  );
};

const onRenderOverflowButton = (
  overflowItems: any[] | undefined
): JSX.Element => {
  return (
    <IconButton
      role="menuitem"
      title="Lobby owner options"
      menuIconProps={{ iconName: "More" }}
      menuProps={{ items: overflowItems! }}
    />
  );
};

const Players = observer(() => {
  const tooltipId = useId("tooltip");
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
                  <Player player={player} />
                  <Text variant="tiny" nowrap style={{ maxWidth: "8em" }}>
                    <TooltipHost
                      content={player.currentArticle}
                      // This id is used on the tooltip itself, not the host
                      // (so an element with this id only exists when the tooltip is shown)
                      id={tooltipId}
                    >
                      <Text variant="tiny" nowrap>
                        {player.currentArticle}
                      </Text>
                    </TooltipHost>
                  </Text>
                  {LobbyState.checkOwner() ? (
                    <OverflowSet
                      aria-label="Basic Menu Example"
                      role="menubar"
                      overflowItems={[
                        {
                          key: "ban",
                          name: "Kick and Ban Player",
                          onClick: () => {
                            ban(player.id);
                          },
                        },
                      ]}
                      onRenderOverflowButton={onRenderOverflowButton}
                      onRenderItem={onRenderItem}
                    />
                  ) : (
                    <></>
                  )}
                </PlayerWrapper>
              );
            } else {
              return <></>;
            }
          })}
        </PlayersWrapper>
      </Wrapper>
    </Layout>
  );
});

export default Players;
