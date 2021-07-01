import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";
import Emotes from "./Emotes";
import { TextField, MaskedTextField } from "@fluentui/react/lib/TextField";
import { IIconProps, initializeIcons } from "@fluentui/react";
import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip";
import { IconButton } from "@fluentui/react/lib/Button";

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
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const Input = styled.input`
  flex: 1;
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
        <TextField
          onChange={(e: any) => {
            setMessage(e.target.value);
          }}
          onKeyUp={(ev) => {
            handleKey(ev);
          }}
          value={message}
        ></TextField>
      </InputWrapper>
      <TooltipHost content="Send Message">
        <IconButton
          iconProps={{ iconName: "Send" }}
          title="Emoji"
          ariaLabel="Emoji"
          onClick={() => {
            send();
          }}
        />
      </TooltipHost>
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
        <TooltipHost content="Show Emojis">
          <IconButton
            iconProps={{ iconName: "Emoji2" }}
            title="Emoji"
            ariaLabel="Emoji"
            onClick={() => {
              setDropUpShow(!dropUpShow);
            }}
          />
        </TooltipHost>
      </ShowEmotesWrapper>
    </Layout>
  );
});

export default ChatControls;
