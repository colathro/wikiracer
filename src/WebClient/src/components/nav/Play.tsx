import styled from "styled-components";
import NavLink from "./NavLink";
import NavTitle from "./NavTitle";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Play = () => {
  return (
    <Layout>
      <NavTitle text="Play"></NavTitle>
      <NavLink target="/" text="Lobbies"></NavLink>
      <NavLink target="/howtoplay" text="How To Play"></NavLink>
    </Layout>
  );
};

export default Play;
