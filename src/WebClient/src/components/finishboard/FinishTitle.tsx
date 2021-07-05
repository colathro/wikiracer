import { observer } from "mobx-react-lite";
import styled from "styled-components";

const FinishWrapper = styled.div`
  display: flex;
`;

const FinishTitle = observer(() => {
  return <FinishWrapper>Congrats!</FinishWrapper>;
});

export default FinishTitle;
