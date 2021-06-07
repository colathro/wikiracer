import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";
import Emotes from "./Emotes";

const Layout = styled.div`
  display: flex;
  flex: 1;
`;

const Send = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  margin-right: 1em;
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const Input = styled.input`
  flex: 1;
  margin-right: 1em;
`;

const ShowEmotesWrapper = styled.div`
  position: relative;
`;

const ShowEmotes = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  margin-right: 1em;
`;

const DropUpContainer = styled.div`
  display: flex;
  overflow-y: scroll;
  min-height: 8em;
  min-width: 10em;
  bottom: 2em;
  right: 2em;
  flex: 1;
  position: absolute;
  background-color: ${ThemeManager.theme?.background};
  border: 1px solid ${ThemeManager.theme?.text};
`;

const EmoteWrapper = styled.div`
  margin: 0.3em;
`;

const Emote = styled.img`
  cursor: pointer;
  &:hover {
    background-color: ${ThemeManager.theme?.background2};
  }
  height: 1.5em;
`;

const ChatControls = observer(() => {
  const [message, setMessage] = useState("");
  const [dropUpShow, setDropUpShow] = useState(false);

  const emotes: any = [];

  Emotes.forEach((v, k) => {
    emotes.push({ value: v, key: k });
  });

  const send = () => {
    LobbyState.sendMessage(message, () => {});
    setMessage("");
  };

  const handleKey = (ev: any) => {
    console.log(ev);
    if (ev.keyCode === 13) {
      LobbyState.sendMessage(message, () => {});
      setMessage("");
    }
  };

  const addToMessage = (emote: string) => {
    setMessage(message + " " + emote + " ");
  };

  return (
    <Layout>
      <InputWrapper>
        <Input
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyUp={(ev) => {
            handleKey(ev);
          }}
          value={message}
        ></Input>
      </InputWrapper>
      <Send
        onClick={() => {
          send();
        }}
      >
        Send
      </Send>
      <ShowEmotesWrapper>
        {dropUpShow ? (
          <DropUpContainer>
            {emotes.map((v: any, k: any) => {
              return (
                <EmoteWrapper
                  key={k}
                  onClick={() => {
                    addToMessage(v.key);
                    setDropUpShow(false);
                  }}
                >
                  <Emote src={v.value}></Emote>
                </EmoteWrapper>
              );
            })}
          </DropUpContainer>
        ) : (
          <></>
        )}
        <ShowEmotes
          onClick={() => {
            setDropUpShow(!dropUpShow);
          }}
        >
          Emotes
        </ShowEmotes>
      </ShowEmotesWrapper>
    </Layout>
  );
});

export default ChatControls;
