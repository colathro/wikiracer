import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";
import ThemeManager from "../../Themes";

const Layout = styled.div`
  flex-direction: column;
  display: flex;
  height: 12em;
`;

const Toggle = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Selection = styled.div`
  display: flex;
  margin-bottom: 1em;
`;

const SelectionText = styled.div`
  margin-right: 1em;
`;

const InputContainer = styled.div``;

const DropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: absolute;
  background-color: ${ThemeManager.theme?.background};
  border: 1px solid ${ThemeManager.theme?.text};
`;

const SuggestionButton = styled.a`
  margin: 0.25em;
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Spacer = styled.div`
  width: 1em;
`;

const ButtonSet = styled.div`
  display: flex;
`;

const DisabledInput = styled.input``;

const EnabledInput = styled.input``;

type props = {
  owner: boolean;
};

const TargetArticles = observer((props: props) => {
  console.log(LobbyState.lobby?.endArticle);
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
    console.log(finishArticle);
    LobbyState.setArticles(startArticle, finishArticle, () => {});
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

  return (
    <Layout>
      <Selection>
        <SelectionText>Start:</SelectionText>
        <InputContainer>
          {editable ? (
            <EnabledInput
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
            ></EnabledInput>
          ) : (
            <DisabledInput
              disabled
              value={LobbyState.lobby?.startArticle ?? ""}
            ></DisabledInput>
          )}
          {startFocus && suggestions.length > 0 ? (
            <DropDownContainer>
              {suggestions.map((val, ind) => (
                <SuggestionButton
                  key={ind}
                  onClick={() => {
                    console.log(val);
                    setStartArticle(val);
                    startArticleRef.current = val;
                  }}
                >
                  {val}
                </SuggestionButton>
              ))}
            </DropDownContainer>
          ) : (
            <></>
          )}
        </InputContainer>
      </Selection>
      <Selection>
        <SelectionText>Finish:</SelectionText>
        <InputContainer>
          {editable ? (
            <EnabledInput
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
            ></EnabledInput>
          ) : (
            <DisabledInput
              disabled
              value={LobbyState.lobby?.endArticle ?? ""}
            ></DisabledInput>
          )}
          {finishFocus && suggestions.length > 0 ? (
            <DropDownContainer>
              {suggestions.map((val, ind) => (
                <SuggestionButton
                  key={ind}
                  onClick={() => {
                    console.log(val);
                    setFinishArticle(val);
                    finishArticleRef.current = val;
                  }}
                >
                  {val}
                </SuggestionButton>
              ))}
            </DropDownContainer>
          ) : (
            <></>
          )}
        </InputContainer>
      </Selection>
      {LobbyState.checkOwner() ? (
        editable ? (
          <ButtonSet>
            <Toggle
              onClick={() => {
                save();
              }}
            >
              Save
            </Toggle>
            <Spacer />
            <Toggle
              onClick={() => {
                cancel();
              }}
            >
              Cancel
            </Toggle>
          </ButtonSet>
        ) : (
          <Toggle
            onClick={() => {
              edit();
            }}
          >
            Edit
          </Toggle>
        )
      ) : null}
    </Layout>
  );
});

export default TargetArticles;
