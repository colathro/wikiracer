import { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import { useHistory } from "react-router-dom";
import PopupState from "../../state/PopUpState";
import {
  TextField,
  PrimaryButton,
  CompoundButton,
  Stack,
  IStackProps,
  IStackStyles,
  Text,
} from "@fluentui/react";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const stackTokens = { childrenGap: 25 };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps1: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 300 } },
};
const columnProps2: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 150 } },
};

const JoinLobby = observer(() => {
  let history = useHistory();
  const [joinKey, setJoinKey] = useState("");
  return (
    <Layout>
      <Stack horizontal tokens={stackTokens}>
        <CompoundButton
          primary
          secondaryText="Jump right in and start racing!"
          onClick={() => {
            LobbyState.playNow(() => {
              history.push("/lobby");
            });
          }}
        >
          Play Now!
        </CompoundButton>
        <CompoundButton
          primary
          secondaryText="Invite your friends directly or make it public!"
          onClick={() => {
            LobbyState.createLobby((d: any) => {
              PopupState.showSuccess(
                "Successfully created a lobby, invite your friends!"
              );
              history.push("/lobby");
            });
          }}
        >
          Create a Private Lobby!
        </CompoundButton>
        <TextField
          placeholder="Enter lobby code"
          onChange={(e: any) => {
            setJoinKey(e.target.value);
          }}
          value={joinKey}
        ></TextField>
        <PrimaryButton
          onClick={() => {
            LobbyState.joinLobby(joinKey, (d: any) => {
              history.push("/lobby");
            });
          }}
        >
          Join Lobby
        </PrimaryButton>
      </Stack>
    </Layout>
  );
});

export default JoinLobby;
