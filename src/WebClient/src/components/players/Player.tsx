import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { LobbyPlayer } from "../../types/Lobby";
import { Text } from "@fluentui/react";
import { AuthType } from "../../enums/AuthType";
import { useId } from "@fluentui/react-hooks";
import Avatar from "./Avatar";
import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip";
import { useState } from "react";
import LobbyState from "../../state/LobbyState";

const UserWrapper = styled.span`
  &:hover {
    cursor: pointer;
    font-weight: bold;
  }
`;

const UserIconWrapper = styled.span`
  vertical-align: middle;
`;

const UserIcon = styled.img`
  height: 0.9em;
  margin-right: 0.3em;
`;

const ActionGroup = styled.div`
  display: flex;
`;

const ActionGroup3 = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ToolTipContainer = styled.div`
  margin: 1em;
`;

const styles: Partial<ITooltipHostStyles> = {
  root: { display: "inline-block" },
};
const calloutProps = { gapSpace: 0 };

type props = {
  player: LobbyPlayer;
  showColon?: boolean;
};

const Player = observer((props: props) => {
  const tooltipId = useId("tooltip");
  const [player, setPlayer] = useState<LobbyPlayer>();
  const [lastLoad, setLastLoad] = useState<Date>();

  const loadUser = () => {
    if (lastLoad === undefined || new Date() > lastLoad) {
      var d = new Date();
      d.setSeconds(d.getSeconds() + 30);
      setLastLoad(d);
      LobbyState.inspectPlayer(props.player, setPlayer);
    }
  };

  return (
    <TooltipHost
      content={
        <ToolTipContainer>
          {player !== undefined ? (
            <>
              <ActionGroup>
                <Avatar avatar={props.player.avatar} />
                <Text variant="xLarge">{props.player.displayName}</Text>
              </ActionGroup>
              <ActionGroup3>
                <Text variant="medium">Level {props.player.level}</Text>
              </ActionGroup3>
            </>
          ) : (
            <>Loading</>
          )}
        </ToolTipContainer>
      }
      // Give the user more time to interact with the tooltip before it closes
      closeDelay={500}
      id={tooltipId}
      calloutProps={calloutProps}
      styles={styles}
    >
      <UserWrapper
        onMouseOver={() => {
          loadUser();
          console.log("mouse over");
        }}
      >
        {props.player.authProvider === AuthType.Twitch ? (
          <UserIconWrapper>
            <UserIcon src={"/images/TwitchGlitchPurple.svg"}></UserIcon>
          </UserIconWrapper>
        ) : (
          <></>
        )}
        <Text style={{ fontWeight: 500 }}>
          {props.player.displayName}
          {props.showColon! ? ":" : ""}
        </Text>
      </UserWrapper>
    </TooltipHost>
  );
});

export default Player;
