import { observer } from "mobx-react-lite";
import PopUpState from "../../state/PopUpState";
import FinishBoard from "../finishboard/FinishBoard";
import { mergeStyleSets, Modal } from "@fluentui/react";

const Finish = observer(() => {
  return (
    <Modal
      isOpen={PopUpState.displayFinish}
      onDismiss={() => {
        PopUpState.closeFinish();
      }}
      isBlocking={false}
      containerClassName={contentStyles.container}
    >
      <FinishBoard></FinishBoard>
    </Modal>
  );
});

const contentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
  },
});

export default Finish;
