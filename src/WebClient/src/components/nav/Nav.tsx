import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AuthState from "../../state/AuthState";
import Play from "./Play";
import Stats from "./Stats";
import ThemeManager from "../../Themes";
import Feedback from "./Feedback";
import HowToHelp from "./HowToHelp";
import User from "./User";
import Logo from "./Logo";
import Spacer from "../generic/Spacer";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1em;
  background-color: ${ThemeManager.theme?.background2};
  border-right: 1px solid ${ThemeManager.theme?.text};
`;

const Nav = () => {
  return (
    <Layout>
      <Spacer height={1} />
      <Logo />
      <Spacer height={2} />
      <User />
      <Spacer height={2} />
      <Play />
      <Spacer height={1} />
      <Stats />
      <Spacer height={1} />
      <Feedback />
      <Spacer height={1} />
      <HowToHelp />
    </Layout>
  );
};

export default Nav;
