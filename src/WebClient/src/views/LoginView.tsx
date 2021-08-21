import { observer } from "mobx-react-lite";
import styled from "styled-components";
import AuthState from "../state/AuthState";
import PlayNow from "../components/login/PlayNow";
import PlayNowTwitch from "../components/login/PlayNowTwitch";

const Wrapper = styled.div`
  position: relative;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  background-image: url("/images/bunnies/landing.png");
  background-position: center;
  background-repeat: no-repeat;
`;

const Layout = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const CenteredContainer = styled.div`
  display: flex;
  padding: 1em;
  flex-direction: column;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 1em;
  width: 35em;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  display: flex;
  padding: 1em;
  justify-content: center;
`;

const Logo = styled.img`
  height: 10em;
`;

const LoginView = observer(() => {
  return (
    <Wrapper>
      <Layout>
        <CenteredContainer>
          <LogoContainer>
            <Logo src={"/images/wikiracer-light.png"}></Logo>
          </LogoContainer>
          <ButtonContainer>
            <PlayNow
              action={() => {
                AuthState.loginGuest();
              }}
            ></PlayNow>
            <PlayNowTwitch
              action={() => {
                AuthState.loginTwitch();
              }}
            ></PlayNowTwitch>
          </ButtonContainer>
        </CenteredContainer>
      </Layout>
    </Wrapper>
  );
});

export default LoginView;
