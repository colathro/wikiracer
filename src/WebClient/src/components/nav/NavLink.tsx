import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import ThemeManager from "../../Themes";

type props = {
  target: string;
  text: string;
};

const Layout = styled.div`
  display: flex;
  padding: 0.25em;
`;

const Anchor = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const NavLink = (navProps: props) => {
  const history = useHistory();
  const navigate = (e: any) => {
    e.preventDefault();
    history.push(navProps.target);
  };

  return (
    <Layout>
      <Anchor onClick={navigate}>{navProps.text}</Anchor>
    </Layout>
  );
};

export default NavLink;
