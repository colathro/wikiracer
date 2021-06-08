import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";

const Layout = styled.div`
  display: flex;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const Toggle = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const LobbyControls = observer(() => {
  return (
    <Layout>
      {LobbyState.isStarted() ? "Game Running" : "Waiting To Start"}
      <Toggle
        onClick={() => {
          LobbyState.startGame(() => {});
        }}
      >
        Start Game
      </Toggle>
    </Layout>
  );
});

export default LobbyControls;
