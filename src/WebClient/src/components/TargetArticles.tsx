import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import LobbyState from "../state/LobbyState";

const TargetArticles = observer(() => {
  const [startArticle, setStartArticle] = useState("");
  const [finishArticle, setFinishArticle] = useState("");

  const set = () => {
    LobbyState.setArticles(startArticle, finishArticle, () => {});
  };

  return (
    <div>
      <div>
        Target Articles:
        <div>
          Start:
          <input
            onChange={(e) => {
              setStartArticle(e.target.value);
            }}
            value={startArticle}
          ></input>
          Finish:
          <input
            onChange={(e) => {
              setFinishArticle(e.target.value);
            }}
            value={finishArticle}
          ></input>
          <button
            onClick={() => {
              set();
            }}
          >
            Set Articles
          </button>
        </div>
      </div>
    </div>
  );
});

export default TargetArticles;
