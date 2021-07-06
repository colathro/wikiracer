import { observer } from "mobx-react-lite";
import styled from "styled-components";
import PopUpState from "../../state/PopUpState";
import { DefaultButton } from "@fluentui/react/lib/Button";

const FinishWrapper = styled.div`
  display: flex;
`;

const FinishControls = observer(() => {
  return (
    <FinishWrapper>
      <DefaultButton
        onClick={() => {
          PopUpState.closeFinish();
        }}
      >
        close
      </DefaultButton>
    </FinishWrapper>
  );
});

export default FinishControls;
