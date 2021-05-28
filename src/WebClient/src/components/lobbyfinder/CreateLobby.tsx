import styled from "styled-components";
import ThemeManager from "../../Themes";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import { useHistory } from "react-router-dom";

const Layout = styled.div`
  display: flex;
`;

const Anchor = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const CreateLobby = observer(() => {
  let history = useHistory();
  return (
    <Layout>
      <Anchor
        onClick={() => {
          LobbyState.createLobby((d: any) => {
            history.push("/lobby");
          });
        }}
      >
        Create Lobby
      </Anchor>
    </Layout>
  );
});

export default CreateLobby;
