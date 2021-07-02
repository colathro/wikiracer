import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import LobbyState from "../../state/LobbyState";
import { AuthType } from "../../enums/AuthType";
import ChatMessageText from "./ChatMessageText";
import ChatControls from "./ChatControls";
import { useRef } from "react";
import Player from "../players/Player";

const Layout = styled.div`
  display: flex;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const SendWrapper = styled.div`
  display: flex;
`;

const ChatWrapper = styled.div`
  display: flex;
`;

const ChatInner = styled.div`
  display: flex;
  margin: 0.5em;
  min-height: 10em;
  max-height: 15em;
  min-width: 14em;
  overflow-y: scroll;
  flex-direction: column;
`;

const ChatMessage = styled.p`
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  max-width: 14em;
  min-width: 14em;
  margin-block-start: 0.2em;
  margin-block-end: 0.2em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
`;

const Chat = observer(() => {
  const scrollTarget = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollTarget.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [LobbyState.lobby?.messages]);

  return (
    <Layout>
      <Wrapper>
        <ChatWrapper>
          <ChatInner>
            <div style={{ marginTop: "auto" }}></div>
            {LobbyState.lobby?.messages.map((message, key) => {
              return (
                <ChatMessage key={key}>
                  <Player player={message.author} showColon={true} />
                  <ChatMessageText text={message.text}></ChatMessageText>
                </ChatMessage>
              );
            })}
            <div ref={scrollTarget} />
          </ChatInner>
        </ChatWrapper>
        <SendWrapper>
          <ChatControls />
        </SendWrapper>
      </Wrapper>
    </Layout>
  );
});

export default Chat;
