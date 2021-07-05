import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../Themes";
import AuthState from "../state/AuthState";
import { useState } from "react";
import PopUpState from "../state/PopUpState";

const BackgroundLayout = styled.div`
  position: absolute;
  z-index: -50;
  height: 100vh;
  width: 100vw;
  filter: blur(1.5px);
  background-image: url(/images/background.jpg);
`;

const Layout = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
  align-items: center;
`;

const CenteredContainer = styled.div`
  display: flex;
  padding: 1em;
  flex-direction: column;
  background-color: ${ThemeManager.theme?.background2};
  border: 1px solid ${ThemeManager.theme?.text};
`;

const LogoContainer = styled.div`
  display: flex;
  padding: 1em;
  justify-content: center;
`;

const Logo = styled.img`
  height: 8em;
`;

const BetaCodeContainer = styled.div`
  display: flex;
  padding: 1em;
  justify-content: center;
`;

const BetaCodeText = styled.div`
  margin-right: 1em;
`;

const BetaCodeInput = styled.input``;

const ButtonContainer = styled.div`
  display: flex;
  padding: 1em;
  justify-content: space-around;
`;

const Button = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  margin-right: 1em;
`;

const LoginView = observer(() => {
  const [betaKey, setBetaKey] = useState("");
  return (
    <Layout>
      <BackgroundLayout></BackgroundLayout>
      <CenteredContainer>
        <LogoContainer>
          <Logo src={"/images/" + ThemeManager.theme?.logo}></Logo>
        </LogoContainer>
        <BetaCodeContainer>
          <BetaCodeText>Beta Code:</BetaCodeText>
          <BetaCodeInput
            value={betaKey}
            onChange={(e) => {
              setBetaKey(e.target.value);
            }}
          ></BetaCodeInput>
        </BetaCodeContainer>
        <ButtonContainer>
          <Button
            onClick={() => {
              if (betaKey !== "wrbeta") {
                PopUpState.showError(
                  "WikiRacer is currently in closed beta. You need to provide a Beta Code to play!"
                );
                return;
              }
              AuthState.loginGuest();
            }}
          >
            Sign in as guest
          </Button>
          <Button
            onClick={() => {
              if (betaKey !== "wrbeta") {
                PopUpState.showError(
                  "WikiRacer is currently in closed beta. You need to provide a Beta Code to play!"
                );
                return;
              }
              AuthState.loginTwitch();
            }}
          >
            Sign in with Twitch
          </Button>
        </ButtonContainer>
      </CenteredContainer>
    </Layout>
  );
});

export default LoginView;
