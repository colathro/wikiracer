import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import PopUpState, { Level, MessageType } from "../../state/PopUpState";

type props = {
  message: MessageType;
  num: number;
};

const Layout = styled.div`
  pointer-events: auto;
  display: flex;
  margin: 1em;
  margin-top: 0em;
  margin-bottom: 1em;
  border: 1px solid ${ThemeManager.theme?.text};
  width: 360px;
  background-color: ${ThemeManager.theme?.background2};
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  margin: 14px;
`;

const MessageText = styled.div`
  margin-left: 1em;
  margin-right: 1em;
`;

const Close = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Image = styled.img`
  height: 2em;
`;

const Message = observer((props: props) => {
  let targetSvg: string;
  switch (props.message.Level) {
    case Level.Success:
      targetSvg = "images/icons/success.svg";
      break;
    case Level.Error:
      targetSvg = "images/icons/error.svg";
      break;
    case Level.Warning:
      targetSvg = "images/icons/warning.svg";
      break;
  }
  return (
    <Layout>
      <Container>
        <Image src={targetSvg}></Image>
        <MessageText>{props.message.Text}</MessageText>
        <Close
          onClick={() => {
            PopUpState.popMessage(props.message);
          }}
        >
          Close
        </Close>
      </Container>
    </Layout>
  );
});

export default Message;
