import { observer } from "mobx-react-lite";
import styled from "styled-components";
import LobbyState from "../../state/LobbyState";
import { Toggle } from "@fluentui/react/lib/Toggle";

const Layout = styled.div`
  display: flex;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const LobbyVisibility = observer(() => {
  return (
    <Layout>
      <Toggle
        onChange={() => {
          LobbyState.setPublic(() => {});
        }}
        label="Public"
        defaultChecked={LobbyState.lobby?.isPublic}
        onText="On"
        offText="Off"
      ></Toggle>
    </Layout>
  );
});

export default LobbyVisibility;
