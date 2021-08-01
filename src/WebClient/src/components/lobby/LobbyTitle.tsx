import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import LobbyState from "../../state/LobbyState";
import {
  mergeStyleSets,
  Callout,
  TextField,
  ITextField,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { Label } from "@fluentui/react/lib/Label";
import { useRef } from "react";
import PopUpState from "../../state/PopUpState";

const Layout = styled.div`
  display: flex;
  justify-content: center;
`;

const CopyContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1em;
`;

const LobbyKey = observer(() => {
  const lobby = LobbyState.lobby!.key;
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const buttonId = useId("callout-button");
  const textAreaRef = useRef<ITextField | null>(null);

  const copyToClipboard = (e: any) => {
    textAreaRef.current!.select();
    document.execCommand("copy");
    PopUpState.showSuccess("Copied join link.");
  };

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
          <CopyContainer>
            <TextField
              value={`${window.document.URL}?joinkey=${lobby}`}
              readOnly
              componentRef={textAreaRef}
            />
            <IconButton
              onClick={copyToClipboard}
              iconProps={{ iconName: "Copy" }}
            ></IconButton>
          </CopyContainer>
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
