import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import LobbyState from "../state/LobbyState";
import Autosuggest from 'react-autosuggest';

type Suggestion = {
  text: string
};

const TargetArticles = observer(() => {
  const [editable, setEditable] = useState(false);
  const [suggestionRenderTime, setSuggestionRenderTime] = useState(Date.now());
  const [startArticle, setStartArticle] = useState(LobbyState.lobby?.startArticle ?? "");
  const [startArticleSuggestions, setStartArticleSuggestions] = useState([] as Array<Suggestion>);
  const [finishArticleSuggestions, setFinishArticleSuggestions] = useState([] as Array<Suggestion>);
  const [finishArticle, setFinishArticle] = useState(LobbyState.lobby?.endArticle ?? "");

  const set = () => {
    setEditable(false);
    LobbyState.setArticles(startArticle, finishArticle, () => {});
  };

  const getSuggestions = async (value: any) => {
    setSuggestionRenderTime(Date.now());
    var list = [] as Array<Suggestion>;
    var data = await LobbyState.searchArticles(value);
    data.forEach((element: string) => list.push( { text: element }));
  
    return list;
  };

  const getSuggestionValue = (suggestion: any) => suggestion.text;

  const shouldRenderSuggestion = (value: any) => {
    return value.trim().length != 0;
  };

  const renderSuggestion = (suggestion: any) => (
    <div>
      {suggestion.text}
    </div>
  );

  const startOnChange = (event: any, { newValue }: any) => {
    setStartArticle(newValue);
  };

  const startOnSuggestionsClearRequested = () => {
    setStartArticleSuggestions([]);
  };

  const startOnSuggestionsFetchRequested = async ({ value }: any) => {
    setStartArticleSuggestions(await getSuggestions(value));
  };

  const startInputProps = {
    placeholder: 'Search for a starting article',
    value: startArticle,
    onChange: startOnChange
  };
  
  const finishOnChange = (event: any, { newValue }: any) => {
    setFinishArticle(newValue);
  };

  const finishOnSuggestionsClearRequested = () => {
    setFinishArticleSuggestions([]);
  };

  const finishOnSuggestionsFetchRequested = async ({ value }: any) => {
    setFinishArticleSuggestions(await getSuggestions(value));
  };

  const endInputProps = {
    placeholder: 'Search for a finishing article',
    value: finishArticle,
    onChange: finishOnChange
  };

  return (
    <div>
      <div>
        Target Articles:
        <div>
          Start:
          {editable ? (
            <Autosuggest
              suggestions={startArticleSuggestions}
              onSuggestionsFetchRequested={startOnSuggestionsFetchRequested}
              onSuggestionsClearRequested={startOnSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={startInputProps}
            />
          ) : (
            LobbyState.lobby?.startArticle
          )}
          Finish:
          {editable ? (
            <Autosuggest
              suggestions={finishArticleSuggestions}
              onSuggestionsFetchRequested={finishOnSuggestionsFetchRequested}
              onSuggestionsClearRequested={finishOnSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={endInputProps}
            />
          ) : (
            LobbyState.lobby?.endArticle
          )}
          {LobbyState.checkOwner() ? (
            editable ? (
              <button
                onClick={() => {
                  set();
                }}
              >
                Set Articles
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditable(true);
                }}
              >
                Edit
              </button>
            )
          ) : ( null )}
        </div>
      </div>
    </div>
  );
});

export default TargetArticles;
