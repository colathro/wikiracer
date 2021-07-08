import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Logo from "./Logo";
import User from "./User";
import Spacer from "../generic/Spacer";
import Footer from "./Footer";
import {
  Nav,
  INavLinkGroup,
  IRenderGroupHeaderProps,
} from "@fluentui/react/lib/Nav";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Navigation = () => {
  const history = useHistory();

  const activeKey = window.location.pathname;

  const navLinkGroups: INavLinkGroup[] = [
    {
      name: "Play",
      links: [
        {
          name: "Lobby Finder",
          key: "/",
          url: "s",
          onClick: (e: any) => {
            e.preventDefault();
            history.push("");
          },
        },
        {
          name: "How to Play",
          key: "/howtoplay",
          url: "s",
          onClick: (e: any) => {
            e.preventDefault();
            history.push("howtoplay");
          },
        },
      ],
    },
    {
      name: "Stats",
      links: [
        {
          name: "My Stats",
          key: "/mystats",
          url: "s",
          onClick: (e: any) => {
            e.preventDefault();
            history.push("mystats");
          },
        },
        {
          name: "Leaderboards",
          key: "/leaderboards",
          url: "s",
          onClick: (e: any) => {
            e.preventDefault();
            history.push("leaderboards");
          },
        },
      ],
    },
    {
      name: "Feedback",
      links: [
        {
          name: "Submit an Idea",
          key: "/submitandidea",
          url: "s",
          onClick: (e: any) => {
            e.preventDefault();
            history.push("submitanidea");
          },
        },
        {
          name: "Report a Problem",
          key: "/reportaproblem",
          url: "s",
          onClick: (e: any) => {
            e.preventDefault();
            history.push("reportaproblem");
          },
        },
      ],
    },
  ];

  return (
    <Layout>
      <Spacer height={1} />
      <Logo />
      <Spacer height={2} />
      <User />
      <Spacer height={2} />
      <Nav
        onRenderGroupHeader={_onRenderGroupHeader}
        ariaLabel="Nav example with custom group headers"
        groups={navLinkGroups}
        initialSelectedKey={activeKey}
      />
      <Footer />
    </Layout>
  );
};

const _onRenderGroupHeader = (
  props: IRenderGroupHeaderProps | undefined
): JSX.Element => {
  return <h3>{props!.name}</h3>;
};

export default Navigation;
