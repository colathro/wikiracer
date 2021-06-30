import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import CreateLobby from "./CreateLobby";
import PublicLobbies from "./PublicLobbies";
import JoinLobby from "./JoinLobby";
import { MessageBar, MessageBarType } from "@fluentui/react";

const BigLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BetaBannerWrapper = styled.div`
  display: flex;
  max-width: 1000px;
`;

const BannerText = styled.div`
  background-color: yellow;
  padding: 0.5em;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
  margin-top: 2em;
`;

const Header = styled.h1`
  font-weight: normal;
  font-size: 3em;
  max-width: 50%;
  border-bottom: 0.5px solid ${ThemeManager.theme?.text};
`;

const LobbyFinder = observer(() => {
  return (
    <BigLayout>
      <BetaBannerWrapper>
        <MessageBar messageBarType={MessageBarType.warning}>
          Wiki Racer is currently in closed beta. This means all features and
          data is subject to deletion. Expect all your history to be
          periodically removed while we develop!
        </MessageBar>
      </BetaBannerWrapper>
      <Layout>
        <Container>
          <CreateLobby />
        </Container>
        <Container>
          <JoinLobby />
        </Container>
        <Container>
          <PublicLobbies />
        </Container>
      </Layout>
    </BigLayout>
  );
});

export default LobbyFinder;
