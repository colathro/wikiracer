import { useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import LobbyState from "../../state/LobbyState";
import Emotes from "./Emotes";
import { TextField, ITextField } from "@fluentui/react/lib/TextField";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import { IconButton } from "@fluentui/react/lib/Button";

const Layout = styled.div`
  display: flex;
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const ShowEmotesWrapper = styled.div`
  position: relative;
`;

const DropUpContainer = styled.div`
  display: flex;
  min-height: 8em;
  width: 10em;
  bottom: 2em;
  right: 2em;
  flex: 1;
  position: absolute;
  background-color: ${ThemeManager.theme?.background};
  box-shadow: rgb(0 0 0 / 13%) 0px 3.2px 7.2px 0px,
    rgb(0 0 0 / 11%) 0px 0.6px 1.8px 0px;
  outline: transparent;
`;

const DropUpWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
`;

const EmoteWrapper = styled.div`
  margin: 0.3em;
  height: 1.5em;
  width: 1.5em;
`;

const Emote = styled.img`
  cursor: pointer;
  &:hover {
    background-color: ${ThemeManager.theme?.background2};
  }
  height: 1.5em;
  width: 1.5em;
`;

const ChatControls = observer(() => {
  const [message, setMessage] = useState("");
  const [dropUpShow, setDropUpShow] = useState(false);
  const inputTarget = useRef<null | ITextField>(null);

  const emotes: any = [];

  Emotes.forEach((v, k) => {
    emotes.push({ value: v, key: k });
  });

  const send = () => {
    LobbyState.sendMessage(message, () => {});
    setMessage("");
  };

  const handleKey = (ev: any) => {
    if (ev.keyCode === 13) {
      LobbyState.sendMessage(message, () => {});
      setMessage("");
    }
  };

  const addToMessage = (emote: string) => {
    if (message.endsWith(" ")) {
      setMessage(message + emote + " ");
    } else {
      setMessage(message + " " + emote + " ");
    }
  };

  const setFocus = () => {
    console.log(inputTarget.current);
    inputTarget.current?.focus();
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
          componentRef={inputTarget}
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
            <DropUpWrapper>
              {emotes.map((v: any, k: any) => {
                return (
                  <TooltipHost content={v.key} key={k}>
                    <EmoteWrapper
                      key={k}
                      onClick={() => {
                        addToMessage(v.key);
                        setFocus();
                        setDropUpShow(false);
                      }}
                    >
                      <Emote src={v.value}></Emote>
                    </EmoteWrapper>
                  </TooltipHost>
                );
              })}
            </DropUpWrapper>
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
