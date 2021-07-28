import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Link, Text } from "@fluentui/react";

const Layout = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: 0.25em;
  flex: 1;
  margin-bottom: 0.5em;
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
        <Text>
          <Link onClick={navigateCookie}>Cookie policy</Link>
        </Text>
        <Text>
          <Link onClick={navigatePrivacy}>Privacy policy</Link>
        </Text>
      </Container>
    </Layout>
  );
};

export default Footer;
