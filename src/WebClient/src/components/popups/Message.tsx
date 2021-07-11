import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import PopUpState, { Level, MessageType } from "../../state/PopUpState";
import { Text, DefaultButton, TextField } from "@fluentui/react";

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
  box-shadow: rgb(0 0 0 / 13%) 0px 3.2px 7.2px 0px,
    rgb(0 0 0 / 11%) 0px 0.6px 1.8px 0px;
  outline: transparent;
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
        <MessageText>
          <Text>{props.message.Text}</Text>
        </MessageText>
        <DefaultButton
          onClick={() => {
            PopUpState.popMessage(props.message);
          }}
        >
          Close
        </DefaultButton>
      </Container>
    </Layout>
  );
});

export default Message;
