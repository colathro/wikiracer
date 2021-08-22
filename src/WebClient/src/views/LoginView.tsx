import { observer } from "mobx-react-lite";
import styled from "styled-components";
import AuthState from "../state/AuthState";
import PlayNow from "../components/login/PlayNow";
import PlayNowTwitch from "../components/login/PlayNowTwitch";
import history from "../History";
import { Text, Link } from "@fluentui/react";

const Layout = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 1em;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  margin-top: 3em;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3em;
  margin-bottom: 3em;
`;

const Spacer = styled.div`
  width: 10px;
`;

const Footer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  left: 0;
  bottom: 0;
  width: 100%;
  margin-bottom: 4px;
`;

const LoginView = observer(() => {
  return (
    <Layout>
      <LogoContainer>
        <img src="/images/wikiracer-dark.png"></img>
      </LogoContainer>
      <TextContainer>
        <p>
          <Text variant="xxLarge">
            Invite your friends or play solo to get on the leaderboard!
          </Text>
        </p>
        <p>
          <Text variant="large">
            Level up and earn coins to unlock new avatars!
          </Text>
        </p>
        <p>
          <Text variant="large">
            Save your stats by signing in with Twitch!
          </Text>
        </p>
      </TextContainer>
      <ButtonContainer>
        <PlayNow
          action={() => {
            AuthState.loginGuest();
          }}
        ></PlayNow>
        <Spacer></Spacer>
        <PlayNowTwitch
          action={() => {
            AuthState.loginTwitch();
          }}
        ></PlayNowTwitch>
      </ButtonContainer>
      <Footer>
        <Link
          onClick={() => {
            history.push("/team");
          }}
        >
          The Team ❤️
        </Link>
        <Spacer></Spacer>
        <Link
          onClick={() => {
            history.push("/cookie");
          }}
        >
          Cookie Policy 🍪
        </Link>
      </Footer>
    </Layout>
  );
});

export default LoginView;
