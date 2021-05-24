import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import LobbyState from "../state/LobbyState";

const TargetArticles = observer(() => {
  const [editable, setEditable] = useState(false);
  const [startArticle, setStartArticle] = useState("");
  const [finishArticle, setFinishArticle] = useState("");

  const set = () => {
    setEditable(false);
    LobbyState.setArticles(startArticle, finishArticle, () => {});
  };

  return (
    <div>
      <div>
        Target Articles:
        <div>
          Start:
          {editable ? (
            <input
              onChange={(e) => {
                setStartArticle(e.target.value);
              }}
              value={startArticle}
            />
          ) : (
            LobbyState.lobby?.startArticle
          )}
          Finish:
          {editable ? (
            <input
              onChange={(e) => {
                setFinishArticle(e.target.value);
              }}
              value={finishArticle}
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
