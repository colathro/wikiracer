import { observer } from "mobx-react-lite";
import styled from "styled-components";
import LobbyState from "../../state/LobbyState";
import { Game } from "../../types/Lobby";
import FinishRecord from "./FinishRecord";

const calculateTimeLeft = (start: Date, end: Date) => {
  let difference = +end - +start;

  const timeLeft = {
    countDown: false,
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    milliseconds: Math.floor(difference % 1000),
  };

  return timeLeft;
};

const FinishWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const InnerWrapper = styled.div`
  margin: 1em;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

type props = {
  game: Game;
};

const FinishList = (props: props) => {
  return (
    <FinishWrapper>
      <InnerWrapper>
        {props.game?.gameHistories! !== undefined ? (
          props.game?.gameHistories!.map((history, ind) => {
            const timeLeft = calculateTimeLeft(
              new Date(props.game?.startTime!),
              new Date(history.player.finishedTime)
            );
            return (
              <FinishRecord
                game={props.game!}
                timeLeft={timeLeft}
                history={history}
                ind={ind}
                finished={history.player.finished}
              ></FinishRecord>
            );
          })
        ) : (
          <></>
        )}
      </InnerWrapper>
    </FinishWrapper>
  );
};

export default FinishList;
