import styled from "styled-components";
import NavLink from "./NavLink";
import NavTitle from "./NavTitle";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Feedback = () => {
  return (
    <Layout>
      <NavTitle text="Feedback"></NavTitle>
      <NavLink target="/submitanidea" text="Submit an Idea"></NavLink>
      <NavLink target="/reportaproblem" text="Report a Problem"></NavLink>
    </Layout>
  );
};

export default Feedback;
