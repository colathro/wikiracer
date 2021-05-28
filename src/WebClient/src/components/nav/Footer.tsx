import ThemeManager from "../../Themes";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const Layout = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: 0.25em;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Anchor = styled.a`
  display: flex;
  font-size: 0.75em;
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  const history = useHistory();
  const navigateCookie = (e: any) => {
    e.preventDefault();
    history.push("/cookie");
  };
  const navigatePrivacy = (e: any) => {
    e.preventDefault();
    history.push("/privacy");
  };
  return (
    <Layout>
      <Container>
        <Anchor onClick={navigateCookie}>Cookie Policy</Anchor>
        <Anchor onClick={navigatePrivacy}>Privacy Policy</Anchor>
      </Container>
    </Layout>
  );
};

export default Footer;
