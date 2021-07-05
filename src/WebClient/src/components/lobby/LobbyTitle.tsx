import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";
import {
  mergeStyleSets,
  DelayedRender,
  Callout,
  Text,
  TextField,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Label } from "@fluentui/react/lib/Label";

const Layout = styled.div`
  display: flex;
  justify-content: center;
`;

const LobbyKey = observer(() => {
  const lobby = LobbyState.lobby!.key;
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const buttonId = useId("callout-button");

  return (
    <Layout>
      <DefaultButton
        id={buttonId}
        className={styles.button}
        onClick={toggleIsCalloutVisible}
      >
        Invite Friends
      </DefaultButton>
      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          target={`#${buttonId}`}
          onDismiss={toggleIsCalloutVisible}
          role="status"
          aria-live="assertive"
        >
          <Label></Label>
          <TextField label="Lobby Key:" value={lobby} readOnly />
        </Callout>
      )}
    </Layout>
  );
});

const LobbyLeave = observer(() => {
  let history = useHistory();
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const buttonId = useId("callout-button");

  return (
    <Layout>
      <DefaultButton
        id={buttonId}
        onClick={toggleIsCalloutVisible}
        text="Leave"
        className={styles.button}
      />
      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          target={`#${buttonId}`}
          onDismiss={toggleIsCalloutVisible}
          role="status"
          aria-live="assertive"
        >
          <Label>Are you sure you want to leave?</Label>
          <DefaultButton
            onClick={() => {
              LobbyState.leaveLobby();
              history.push("/");
            }}
          >
            Yes
          </DefaultButton>
        </Callout>
      )}
    </Layout>
  );
});

const LobbyTitle = observer(() => {
  return (
    <Layout>
      <LobbyLeave />
      <LobbyKey />
    </Layout>
  );
});

const styles = mergeStyleSets({
  button: {
    margin: "4px",
  },
  callout: {
    padding: "12px 12px",
  },
});

export default LobbyTitle;
