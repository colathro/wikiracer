import styled from "styled-components";

const None = styled.span``;
const Italic = styled.span`
  font-style: italic;
`;
const Bold = styled.span`
  font-weight: 600;
`;
const Underline = styled.span`
  text-decoration: underline;
`;

type props = {
  span: any;
};

const ArticleSpan = (props: props) => {
  if (props.span.text.includes('class="wikitable')) {
    return <></>;
  }
  switch (props.span.style) {
    case 0:
      return <None>{props.span.text}</None>;
    case 1:
      return <Italic>{props.span.text}</Italic>;
    case 2:
      return <Bold>{props.span.text}</Bold>;
    case 3:
      return <Underline>{props.span.text}</Underline>;
    default:
      return <></>;
  }
};

export default ArticleSpan;
