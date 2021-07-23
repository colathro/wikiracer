import { useState, useRef } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import ThemeManager from "../../Themes";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack, IStackTokens } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { ActionButton } from "@fluentui/react/lib/Button";
import { SpinButton, ISpinButtonStyles } from "@fluentui/react/lib/SpinButton";

const Layout = styled.div`
  flex-direction: column;
  display: flex;
`;

const Selection = styled.div`
  display: flex;
  margin-bottom: 1em;
`;

const InputContainer = styled.div``;

const DropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  width: 200px;
  flex: 1;
  position: absolute;
  background-color: ${ThemeManager.theme?.background};
  box-shadow: rgb(0 0 0 / 13%) 0px 3.2px 7.2px 0px,
    rgb(0 0 0 / 11%) 0px 0.6px 1.8px 0px;
  outline: transparent;
`;

const stackTokens: IStackTokens = { childrenGap: 40 };

type props = {
  owner: boolean;
};

const TargetArticles = observer((props: props) => {
  const [editable, setEditable] = useState(false);
  const [awaiting, setAwaiting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [startFocus, setStartFocus] = useState(false);
  const [finishFocus, setFinishFocus] = useState(false);
  const [startArticle, setStartArticle] = useState(
    LobbyState.lobby?.startArticle ?? ""
  );
  const [finishArticle, setFinishArticle] = useState(
    LobbyState.lobby?.endArticle ?? ""
  );

  const [gameLength, setGameLength] = useState(
    LobbyState.lobby?.currentGameLength ?? 4
  );

  const startArticleRef = useRef<string>(startArticle);
  const finishArticleRef = useRef<string>(finishArticle);

  const loadFinishSuggestions = (e: any) => {
    setFinishArticle(e.target.value);
    finishArticleRef.current = e.target.value;
    if (!awaiting) {
      setAwaiting(true);
      setTimeout(() => {
        LobbyState.searchArticles(finishArticleRef, (data: string[]) => {
          setSuggestions(data);
        }).then(() => {
          setAwaiting(false);
        });
      }, 1000);
    }
  };

  const loadStartSuggestions = (e: any) => {
    setStartArticle(e.target.value);
    startArticleRef.current = e.target.value;
    if (!awaiting) {
      setAwaiting(true);
      setTimeout(() => {
        LobbyState.searchArticles(startArticleRef, (data: string[]) => {
          setSuggestions(data);
        }).then(() => {
          setAwaiting(false);
        });
      }, 1000);
    }
  };

  const save = () => {
    LobbyState.setArticles(startArticle, finishArticle, gameLength, () => {});
    setEditable(false);
  };

  const cancel = () => {
    setEditable(false);
  };

  const edit = () => {
    setEditable(true);
    setStartArticle(LobbyState.lobby?.startArticle ?? "");
    setFinishArticle(LobbyState.lobby?.endArticle ?? "");
  };

  const updateGameLength = (e: any) => {
    var val = Number(e.target.value);
    if (val < 1) {
      val = 1;
    } else if (val > 15) {
      val = 15;
    }
    setGameLength(val);
  };

  const incrementGameLength = () => {
    var val = 1;
    if (gameLength > 14) {
      val = 0;
    }
    setGameLength(gameLength + val);
  };

  const decrementGameLength = () => {
    var val = 1;
    if (gameLength < 2) {
      val = 0;
    }
    setGameLength(gameLength - val);
  };

  return (
    <Layout>
      <Selection>
        <InputContainer>
          <SpinButton
            min={1}
            max={15}
            disabled={!editable}
            value={gameLength?.toString()}
            onChange={updateGameLength}
            onIncrement={incrementGameLength}
            onDecrement={decrementGameLength}
          />
        </InputContainer>
      </Selection>
      <Selection>
        <InputContainer>
          <TextField
            onFocus={() => {
              setStartFocus(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setStartFocus(false);
              }, 200);
            }}
            onChange={(e: any) => {
              loadStartSuggestions(e);
            }}
            value={startArticle}
            placeholder="Choose a start"
            label="Start:"
            disabled={!editable}
            autoComplete="off"
          ></TextField>

          {startFocus && suggestions.length > 0 ? (
            <DropDownContainer>
              {suggestions.map((val, ind) => (
                <ActionButton
                  key={ind}
                  onClick={() => {
                    setStartArticle(val);
                    startArticleRef.current = val;
                  }}
                >
                  {val}
                </ActionButton>
              ))}
            </DropDownContainer>
          ) : (
            <></>
          )}
        </InputContainer>
      </Selection>
      <Selection>
        <InputContainer>
          <TextField
            onFocus={() => {
              setFinishFocus(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setFinishFocus(false);
              }, 200);
            }}
            onChange={(e: any) => {
              loadFinishSuggestions(e);
            }}
            value={finishArticle}
            placeholder="Choose a finish"
            label="Finish:"
            disabled={!editable}
            autoComplete="off"
          ></TextField>
          {finishFocus && suggestions.length > 0 ? (
            <DropDownContainer>
              {suggestions.map((val, ind) => (
                <ActionButton
                  key={ind}
                  onClick={() => {
                    setFinishArticle(val);
                    finishArticleRef.current = val;
                  }}
                >
                  {val}
                </ActionButton>
              ))}
            </DropDownContainer>
          ) : (
            <></>
          )}
        </InputContainer>
      </Selection>
      <div>
        {LobbyState.checkOwner() ? (
          editable ? (
            <Stack horizontal tokens={stackTokens}>
              <PrimaryButton
                onClick={() => {
                  save();
                }}
              >
                Save
              </PrimaryButton>
              <PrimaryButton
                onClick={() => {
                  cancel();
                }}
              >
                Cancel
              </PrimaryButton>
            </Stack>
          ) : (
            <PrimaryButton
              onClick={() => {
                edit();
              }}
            >
              Edit
            </PrimaryButton>
          )
        ) : null}
      </div>
    </Layout>
  );
});

export default TargetArticles;
