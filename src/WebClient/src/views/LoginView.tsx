import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../Themes";
import AuthState from "../state/AuthState";
import { useState } from "react";
import PopUpState from "../state/PopUpState";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { TextField, Label } from "@fluentui/react";

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

const BetaCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 1em;
  justify-content: space-around;
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
            <DefaultButton
              onClick={() => {
                AuthState.loginGuest();
              }}
            >
              Sign in as guest
            </DefaultButton>
            <DefaultButton
              style={{ backgroundColor: "#6441a5", color: "#fff" }}
              onClick={() => {
                AuthState.loginTwitch();
              }}
            >
              Sign in with Twitch.tv
            </DefaultButton>
          </ButtonContainer>
        </CenteredContainer>
      </Layout>
    </Wrapper>
  );
});

export default LoginView;
