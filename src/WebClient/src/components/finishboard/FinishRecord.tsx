import { useState } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Game, GameHistory } from "../../types/Lobby";
import FinishDetails from "./FinishDetails";
import Player from "../players/Player";
import { DefaultButton } from "@fluentui/react/lib/Button";

const FinishRecordWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;

const FinishRecordMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FinishTime = styled.span``;

type props = {
  game: Game;
  history: GameHistory;
  timeLeft: any;
  finished: boolean;
};

const FinishRecord = observer((props: props) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <FinishRecordWrapper>
      <FinishRecordMain>
        <Player player={props.history.player}></Player>
        <DefaultButton
          onClick={() => {
            setDetailsOpen(!detailsOpen);
          }}
        >
          {detailsOpen ? "Hide" : "Show"} Details
        </DefaultButton>
        <FinishTime>
          {props.finished ? (
            <span>
              Finished in: {props.timeLeft.minutes}:{props.timeLeft.seconds}.
              {props.timeLeft.milliseconds}
            </span>
          ) : (
            <span>Didn't finish</span>
          )}
        </FinishTime>
      </FinishRecordMain>
      <FinishDetails
        finished={props.finished}
        finishTime={props.history.player.finishedTime}
        startTime={props.game.startTime}
        endTime={props.game.finishTime}
        open={detailsOpen}
        navigations={props.history.navigations}
      ></FinishDetails>
    </FinishRecordWrapper>
  );
});

export default FinishRecord;
