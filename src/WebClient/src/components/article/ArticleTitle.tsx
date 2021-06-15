import ThemeManager from "../../Themes";
import styled from "styled-components";

const Layout = styled.div`
  width: 100%;
  margin-bottom: 3em;
`;

const Title = styled.h1`
  border-bottom: 1px solid ${ThemeManager.theme?.text};
  font-weight: 400;
  margin-bottom: 0.2em;
  font-family: "Linux Libertine", "Georgia", "Times", serif;
`;

const SubTitle = styled.div``;

type props = {
  title: string;
};

const ArticleTitle = (props: props) => {
  return (
    <Layout>
      <Title>{props.title}</Title>
      <SubTitle>From Wikipedia, the free encyclopedia</SubTitle>
    </Layout>
  );
};

export default ArticleTitle;
