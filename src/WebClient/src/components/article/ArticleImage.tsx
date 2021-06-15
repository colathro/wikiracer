import ThemeManager from "../../Themes";
import styled from "styled-components";

const RightLayout = styled.div`
  border: 1px solid ${ThemeManager.theme?.text3};
  display: block;
  float: right;
  margin-bottom: 18.2px;
  margin-left: 19.6px;
  margin-right: 0px;
  margin-top: 7px;
`;

const LeftLayout = styled.div`
  border: 1px solid ${ThemeManager.theme?.text3};
  display: block;
  float: left;
  margin-bottom: 18.2px;
  margin-right: 19.6px;
  margin-left: 0px;
  margin-top: 7px;
`;

const Wrapper = styled.div`
  margin: 0.5em;
`;

const Image = styled.img`
  min-height: 140px;
`;

type props = {
  span: any;
};

const ArticleImage = (props: props) => {
  console.log(props.span.args);
  if (props.span.args.includes("left")) {
    return (
      <LeftLayout>
        <Wrapper>
          <Image src={`/api/image?imageurl=${props.span.link}`}></Image>
        </Wrapper>
      </LeftLayout>
    );
  } else {
    return (
      <RightLayout>
        <Wrapper>
          <Image src={`/api/image?imageurl=${props.span.link}`}></Image>
        </Wrapper>
      </RightLayout>
    );
  }
};

export default ArticleImage;
