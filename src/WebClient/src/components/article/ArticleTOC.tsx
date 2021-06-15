import ThemeManager from "../../Themes";
import styled from "styled-components";

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

const ArticleTOC = () => {
  return <Layout>test</Layout>;
};

export default ArticleTOC;
