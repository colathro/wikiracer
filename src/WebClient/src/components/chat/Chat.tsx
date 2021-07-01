import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";
import { AuthType } from "../../enums/AuthType";
import ChatMessageText from "./ChatMessageText";
import ChatControls from "./ChatControls";

const Layout = styled.div`
  display: flex;
  flex: 1;
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
  flex: 1;
  flex-direction: column-reverse;
`;

const ChatInner = styled.div`
  margin: 0.5em;
`;

const ChatMessage = styled.div``;

const UserWrapper = styled.span``;

const Username = styled.span`
  margin-right: 0.3em;
`;

const UserIconWrapper = styled.span`
  vertical-align: middle;
`;

const UserIcon = styled.img`
  height: 0.9em;
  margin-right: 0.3em;
`;

const Chat = observer(() => {
  return (
    <Layout>
      <Wrapper>
        <ChatWrapper>
          <ChatInner>
            {LobbyState.lobby?.messages.map((message, key) => {
              return (
                <ChatMessage key={key}>
                  <UserWrapper>
                    {message.author.authProvider === AuthType.Twitch ? (
                      <UserIconWrapper>
                        <UserIcon
                          src={"/images/TwitchGlitchPurple.svg"}
                        ></UserIcon>
                      </UserIconWrapper>
                    ) : (
                      <></>
                    )}
                    <Username>{message.author.displayName}:</Username>
                  </UserWrapper>
                  <ChatMessageText text={message.text}></ChatMessageText>
                </ChatMessage>
              );
            })}
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
