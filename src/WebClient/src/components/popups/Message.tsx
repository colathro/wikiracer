import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import PopUpState, { MessageType } from "../../state/PopUpState";

type props = {
  message: MessageType;
  num: number;
};

const Layout = styled.div`
  pointer-events: auto;
  display: flex;
  margin: 20px;
  border: 1px solid ${ThemeManager.theme?.text};
  width: 280px;
  background-color: ${ThemeManager.theme?.background2};
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  margin: 14px;
`;

const MessageText = styled.div``;

const Close = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Message = observer((props: props) => {
  return (
    <Layout>
      <Container>
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
