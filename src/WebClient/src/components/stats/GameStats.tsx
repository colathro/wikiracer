import { DefaultButton, Text, TooltipHost } from "@fluentui/react";
import { useState } from "react";
import styled from "styled-components";
import { Game } from "../../types/Lobby";
import FinishList from "../finishboard/FinishList";
import { useId } from "@fluentui/react-hooks";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-around;
  flex: 1;
`;

type props = {
  game: Game;
};

const GameStats = (props: props) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const startId = useId("tooltip");
  const finishId = useId("tooltip");
  return (
    <Layout>
      <Title>
        <div>
          <Text variant="medium" nowrap style={{ maxWidth: "8em" }}>
            <TooltipHost
              content={props.game.startArticle}
              // This id is used on the tooltip itself, not the host
              // (so an element with this id only exists when the tooltip is shown)
              id={startId}
            >
              <Text variant="medium" nowrap>
                {props.game.startArticle}
              </Text>
            </TooltipHost>
          </Text>
          <Text> ➡ </Text>
          <Text variant="medium" nowrap style={{ maxWidth: "8em" }}>
            <TooltipHost
              content={props.game.finishArticle}
              // This id is used on the tooltip itself, not the host
              // (so an element with this id only exists when the tooltip is shown)
              id={finishId}
            >
              <Text variant="medium" nowrap>
                {props.game.finishArticle}
              </Text>
            </TooltipHost>
          </Text>
        </div>
        <DefaultButton
          onClick={() => {
            setDetailsOpen(!detailsOpen);
          }}
        >
          {detailsOpen ? "Hide" : "Show"} Details
        </DefaultButton>
      </Title>
      {detailsOpen ? <FinishList game={props.game}></FinishList> : <></>}
    </Layout>
  );
};

export default GameStats;
