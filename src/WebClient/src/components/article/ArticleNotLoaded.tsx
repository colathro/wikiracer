import styled from "styled-components";
import { Spinner } from "@fluentui/react/lib/Spinner";

const Layout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex: 1;
`;

const ArticleNotLoaded = () => {
  return (
    <Layout>
      <Spinner label="Waiting for host to select start article..."></Spinner>
    </Layout>
  );
};

export default ArticleNotLoaded;
