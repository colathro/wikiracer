import { useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import { useHistory } from "react-router-dom";
import PopupState from "../../state/PopUpState";
import {
  TextField,
  PrimaryButton,
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
      <Text variant="xLarge">Join Lobby:</Text>
      <Stack horizontal tokens={stackTokens} styles={stackStyles}>
        <Stack {...columnProps1}>
          <TextField
            placeholder="Enter lobby code"
            onChange={(e: any) => {
              setJoinKey(e.target.value);
            }}
            value={joinKey}
          ></TextField>
        </Stack>
        <Stack {...columnProps2}>
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
        <Stack {...columnProps2}>
          <PrimaryButton
            onClick={() => {
              LobbyState.createLobby((d: any) => {
                PopupState.showSuccess(
                  "Successfully created a lobby, invite your friends!"
                );
                history.push("/lobby");
              });
            }}
          >
            Create Lobby
          </PrimaryButton>
        </Stack>
      </Stack>
    </Layout>
  );
});

export default JoinLobby;
