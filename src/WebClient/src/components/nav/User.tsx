import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthState from "../../state/AuthState";
import ThemeManager from "../../Themes";
import { IIconProps, IContextualMenuProps, Stack, Link } from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { IconButton } from "@fluentui/react/lib/Button";
import { IButtonProps } from "@fluentui/react/lib/Button";
import { Text, ITextProps } from "@fluentui/react/lib/Text";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";
import {
  IPersonaProps,
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "@fluentui/react/lib/Persona";

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

const ActionGroup = styled.div`
  display: flex;
`;

const ActionGroup2 = styled.div`
  display: flex;
`;

const ActionGroup3 = styled.div`
  display: flex;
  justify-content: space-between;
`;

const customCoinClass = mergeStyles({
  borderRadius: 12,
  display: "block",
});

const overflowProps: IButtonProps = { ariaLabel: "More commands" };

const User = observer(() => {
  const history = useHistory();
  const settingsIcon: IIconProps = { iconName: "Settings" };
  const signOutIcon: IIconProps = { iconName: "SignOut" };
  return (
    <Layout>
      <ActionGroup>
        <Persona
          imageUrl={"/penguin.png"}
          onRenderCoin={_onRenderCoin}
          coinSize={48}
        />
        <Text>
          <h2>{AuthState.auth_info?.display_name}</h2>
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
      <ActionGroup2>
        <IconButton
          iconProps={settingsIcon}
          title="Settings"
          ariaLabel="Settings"
          onClick={() => history.push("/settings")}
        />
        <IconButton
          iconProps={signOutIcon}
          title="SignOut"
          ariaLabel="SignOut"
          onClick={() => AuthState.logout()}
        />
      </ActionGroup2>
    </Layout>
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

export default User;
