import styled from "styled-components";
import ThemeManager from "../../Themes";

type props = {
  text: string;
};

const Layout = styled.div`
  display: flex;
  margin-bottom: 0.5em;
  border-bottom: 1px solid ${ThemeManager.theme?.text};
`;

const Header = styled.h2`
  font-weight: normal;
  margin: 0px;
  margin-top: 0.5em;
  padding-bottom: 0.25em;
`;

const NavTitle = (props: props) => {
  return (
    <Layout>
      <Header>{props.text}</Header>
    </Layout>
  );
};

export default NavTitle;
