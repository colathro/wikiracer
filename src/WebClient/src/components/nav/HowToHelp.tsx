import styled from "styled-components";
import NavLink from "./NavLink";
import NavTitle from "./NavTitle";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const HowToHelp = () => {
  return (
    <Layout>
      <NavTitle text="How to Help"></NavTitle>
      <NavLink target="/contributors" text="Contributors"></NavLink>
      <NavLink target="/contribute" text="Contribute"></NavLink>
    </Layout>
  );
};

export default HowToHelp;
