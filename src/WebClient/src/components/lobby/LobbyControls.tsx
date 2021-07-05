import { observer } from "mobx-react-lite";
import styled from "styled-components";
import LobbyState from "../../state/LobbyState";
import { PrimaryButton } from "@fluentui/react/lib/Button";

const Layout = styled.div`
  display: flex;
  margin-top: 1em;
  margin-bottom: 1em;
  justify-content: center;
`;

const LobbyControls = observer(() => {
  return (
    <Layout>
      <PrimaryButton
        onClick={() => {
          LobbyState.startGame(() => {});
        }}
      >
        Start Game
      </PrimaryButton>
      <PrimaryButton
        disabled={!LobbyState.isEarlyEndable()}
        onClick={() => {
          LobbyState.endEarly(() => {});
        }}
      >
        End Game
      </PrimaryButton>
    </Layout>
  );
});

export default LobbyControls;
