import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthState from "../../state/AuthState";
import { IIconProps } from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import { IconButton } from "@fluentui/react/lib/Button";
import { Text } from "@fluentui/react/lib/Text";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";
import Avatar from "../players/Avatar";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
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

const User = observer(() => {
  const history = useHistory();
  const settingsIcon: IIconProps = { iconName: "Settings" };
  const signOutIcon: IIconProps = { iconName: "SignOut" };

  var experience: number = AuthState.user?.experience!;

  return (
    <Layout>
      <ActionGroup>
        <Avatar avatar={AuthState.user?.avatar!} />
        <Text>
          <h2>{AuthState.auth_info?.display_name}</h2>
        </Text>
      </ActionGroup>
      <ProgressIndicator
        label={
          <ActionGroup3>
            <div>Level {AuthState.user?.level}</div>
            <div>
              <Icon iconName="AllCurrency"></Icon> {AuthState.user?.coins}
            </div>
          </ActionGroup3>
        }
        description={`${AuthState.user?.experience} / 1000 Experience`}
        percentComplete={experience / 1000}
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

export default User;
