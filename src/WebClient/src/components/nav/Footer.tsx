import ThemeManager from "../../Themes";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Link } from "@fluentui/react/lib/Link";

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
        <Link onClick={navigateCookie}>Cookie Policy</Link>
        <Link onClick={navigatePrivacy}>Privacy Policy</Link>
      </Container>
    </Layout>
  );
};

export default Footer;
