import ThemeManager from "../../Themes";
import styled from "styled-components";

const Title2 = styled.h2`
  border-bottom: 1px solid ${ThemeManager.theme?.text3};
  font-weight: 400;
  margin-bottom: 0.2em;
  font-family: "Linux Libertine", "Georgia", "Times", serif;
  overflow: hidden;
`;

const Title3 = styled.h4`
  font-family: sans-serif;
  font: Arial;
  font-weight: 600;
  margin-bottom: 0.2em;
`;

const Title4 = styled.h5`
  font-family: sans-serif;
  font: Arial;
  font-weight: 600;
  margin-bottom: 0.2em;
`;

type props = {
  paragraph: any;
};

const ArticleHeader = (props: props) => {
  switch (props.paragraph.level) {
    case 2:
      return <Title2>{props.paragraph.spans[0]?.text}</Title2>;
    case 3:
      return <Title3>{props.paragraph.spans[0]?.text}</Title3>;
    case 4:
      return <Title4>{props.paragraph.spans[0]?.text}</Title4>;
    default:
      return <></>;
  }
};

export default ArticleHeader;
