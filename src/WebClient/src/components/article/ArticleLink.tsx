import ThemeManager from "../../Themes";
import styled from "styled-components";
import { createPublicKey } from "crypto";

const Link = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

type props = {
  span: any;
  click: any;
  children?: never[] | undefined;
};

const ArticleLink = (props: props) => {
  return (
    <Link
      onClick={() => {
        props.click();
      }}
    >
      {props.span.text}
    </Link>
  );
};

export default ArticleLink;
