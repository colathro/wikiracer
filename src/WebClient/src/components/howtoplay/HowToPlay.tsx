import { Text, ProgressIndicator, IconButton } from "@fluentui/react";
import { useEffect, useState } from "react";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-bottom: 1em;
  min-width: 40em;
`;

const ProgressContainer = styled.div`
  min-width: 40em;
  padding-bottom: 1em;
  min-height: 3em;
`;

const HowToPlay = () => {
  const [step, setStep] = useState(1);

  const stepForward = () => {
    setStep(step + 1);
  };

  const stepBackward = () => {
    setStep(step - 1);
  };

  let body;
  let buttons;

  switch (step) {
    case 1:
      body = <Page1 />;
      buttons = (
        <ButtonContainer>
          <IconButton disabled iconProps={{ iconName: "ChevronLeftSmall" }} />
          <IconButton
            onClick={stepForward}
            iconProps={{ iconName: "ChevronRightSmall" }}
          />
        </ButtonContainer>
      );
      break;
    case 2:
      body = <Page2 />;
      buttons = (
        <ButtonContainer>
          <IconButton
            onClick={stepBackward}
            iconProps={{ iconName: "ChevronLeftSmall" }}
          />
          <IconButton
            onClick={stepForward}
            iconProps={{ iconName: "ChevronRightSmall" }}
          />
        </ButtonContainer>
      );
      break;
    case 3:
      body = <Page3 />;
      buttons = (
        <ButtonContainer>
          <IconButton
            onClick={stepBackward}
            iconProps={{ iconName: "ChevronLeftSmall" }}
          />
          <IconButton
            disabled
            onClick={stepForward}
            iconProps={{ iconName: "ChevronRightSmall" }}
          />
        </ButtonContainer>
      );
      break;

    default:
      body = <div>How did you get here?</div>;
      break;
  }

  return (
    <Layout>
      {body}
      {buttons}
      <ProgressContainer>
        <ProgressIndicator percentComplete={step / 3}></ProgressIndicator>
      </ProgressContainer>
    </Layout>
  );
};

export default HowToPlay;
