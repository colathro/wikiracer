import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import FinishTitle from "./FinishTitle";
import FinishList from "./FinishList";
import FinishControls from "./FinishControls";

const FinishWrapper = styled.div`
  display: flex;
  flex: 1;
  position: absolute;
  width: 50vw;
  height: 50vh;
  background-color: ${ThemeManager.theme?.background};
`;

const FinishContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 1em;
`;

const FinishBoard = observer(() => {
  return (
    <FinishWrapper>
      <FinishContent>
        <FinishTitle></FinishTitle>
        <FinishList></FinishList>
        <FinishControls></FinishControls>
      </FinishContent>
    </FinishWrapper>
  );
});

export default FinishBoard;
