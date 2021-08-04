import { observer } from "mobx-react-lite";
import styled from "styled-components";
import PublicLobbies from "./PublicLobbies";
import JoinLobby from "./JoinLobby";
import { MessageBar, MessageBarType } from "@fluentui/react";

const BigLayout = styled.div`
  display: flex;
  max-width: 1000px;
  flex-direction: column;
  align-content: center;
`;

const BetaBannerWrapper = styled.div`
  display: flex;
  max-width: 1000px;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
  margin-top: 2em;
`;

const LobbyFinder = observer(() => {
  return (
    <BigLayout>
      <BetaBannerWrapper>
        <MessageBar messageBarType={MessageBarType.warning}>
          Wiki Racer is currently in open beta. This means all features and data
          is subject to deletion. Expect all your history to be periodically
          removed while we develop!
        </MessageBar>
      </BetaBannerWrapper>
      <Layout>
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
