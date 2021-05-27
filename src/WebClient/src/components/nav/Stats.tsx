import styled from "styled-components";
import NavLink from "./NavLink";
import NavTitle from "./NavTitle";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Stats = () => {
  return (
    <Layout>
      <NavTitle text="Stats"></NavTitle>
      <NavLink target="/mystats" text="My Stats"></NavLink>
      <NavLink target="/leaderboards" text="Leaderboards"></NavLink>
    </Layout>
  );
};

export default Stats;
