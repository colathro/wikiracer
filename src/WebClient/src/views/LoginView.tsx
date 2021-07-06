import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../Themes";
import AuthState from "../state/AuthState";
import { useState } from "react";
import PopUpState from "../state/PopUpState";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react";

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
  box-shadow: rgb(0 0 0 / 13%) 0px 3.2px 7.2px 0px,
    rgb(0 0 0 / 11%) 0px 0.6px 1.8px 0px;
  outline: transparent;
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

const ButtonContainer = styled.div`
  display: flex;
  padding: 1em;
  justify-content: space-around;
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
          <TextField
            label={"Beta Code:"}
            value={betaKey}
            onChange={(e: any) => {
              setBetaKey(e.target.value);
            }}
          ></TextField>
        </BetaCodeContainer>
        <ButtonContainer>
          <DefaultButton
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
          </DefaultButton>
          <DefaultButton
            style={{ backgroundColor: "#6441a5", color: "#fff" }}
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
            Sign in with Twitch.tv
          </DefaultButton>
        </ButtonContainer>
      </CenteredContainer>
    </Layout>
  );
});

export default LoginView;
