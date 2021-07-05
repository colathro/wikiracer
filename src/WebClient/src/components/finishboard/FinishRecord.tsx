import { useState } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import { Game, GameHistory } from "../../types/Lobby";
import FinishDetails from "./FinishDetails";

const FinishRecordWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const FinishRecordMain = styled.div`
  display: flex;
  justify-content: space-between;
`;

const User = styled.span``;

const FinishTime = styled.span``;

const DetailsButton = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  margin-right: 1em;
  user-select: none;
`;

type props = {
  game: Game;
  history: GameHistory;
  timeLeft: any;
  ind: number;
  finished: boolean;
};

const FinishRecord = observer((props: props) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <FinishRecordWrapper key={props.ind}>
      <FinishRecordMain>
        <User>{props.history.player.displayName}</User>
        <DetailsButton
          onClick={() => {
            setDetailsOpen(!detailsOpen);
          }}
        >
          {detailsOpen ? "Hide" : "Show"} Details
        </DetailsButton>
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
