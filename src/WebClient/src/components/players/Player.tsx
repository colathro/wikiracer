import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { LobbyPlayer } from "../../types/Lobby";
import { Text } from "@fluentui/react";
import { AuthType } from "../../enums/AuthType";
import { useId } from "@fluentui/react-hooks";
import { Icon } from "@fluentui/react/lib/Icon";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";
import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip";
import {
  IPersonaProps,
  IPersonaSharedProps,
  Persona,
} from "@fluentui/react/lib/Persona";
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

const customCoinClass = mergeStyles({
  borderRadius: 12,
  display: "block",
});

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
  return (
    <TooltipHost
      content={
        <ToolTipContainer>
          <ActionGroup>
            <Persona
              imageUrl={"/penguin.png"}
              onRenderCoin={_onRenderCoin}
              coinSize={48}
            />
            <Text>
              <h2>{props.player.displayName}</h2>
            </Text>
          </ActionGroup>
          <ProgressIndicator
            label={
              <ActionGroup3>
                <div>Level 12</div>
                <div>
                  <Icon iconName="AllCurrency"></Icon> 420
                </div>
              </ActionGroup3>
            }
            description="602 / 1000 Experience"
            percentComplete={0.6}
          />
        </ToolTipContainer>
      }
      // Give the user more time to interact with the tooltip before it closes
      closeDelay={500}
      id={tooltipId}
      calloutProps={calloutProps}
      styles={styles}
    >
      <UserWrapper>
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

function _onRenderCoin(props: IPersonaProps | undefined): JSX.Element {
  const { coinSize, imageAlt, imageUrl } = props!;
  return (
    <img
      src={imageUrl}
      alt={imageAlt}
      width={coinSize}
      height={coinSize}
      className={customCoinClass}
    />
  );
}

export default Player;
