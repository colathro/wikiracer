import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Icon } from "@fluentui/react/lib/Icon";
import { Text } from "@fluentui/react/lib/Text";
import LobbyState from "../../state/LobbyState";

const FinishWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FinishInner = styled.div`
  display: flex;
  justify-content: space-around;
`;

const FinishInner2 = styled.div`
  display: flex;
  justify-content: center;
`;

const FinishTitle = observer(() => {
  return (
    <FinishWrapper>
      <FinishInner>
        <Text variant="xLarge">Nice Work!</Text>
        <Text variant="large">
          Coins Earned: <Icon iconName="AllCurrency"></Icon>{" "}
          {LobbyState.game?.coinReward}
        </Text>
        <Text variant="large">
          Experience Gained: {LobbyState.game?.experienceReward}
        </Text>
      </FinishInner>
      <FinishInner2 style={{ marginTop: "1em" }}>
        <Text variant="xLarge">{LobbyState.game?.startArticle}</Text>
        <Text
          style={{ marginLeft: "1em", marginRight: "1em" }}
          variant="xLarge"
        >
          ➡
        </Text>
        <Text variant="xLarge">{LobbyState.game?.finishArticle}</Text>
      </FinishInner2>
    </FinishWrapper>
  );
});

export default FinishTitle;
