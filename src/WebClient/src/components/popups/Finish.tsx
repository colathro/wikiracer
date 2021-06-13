import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import PopUpState from "../../state/PopUpState";
import FinishBoard from "../finishboard/FinishBoard";

const Layout = styled.div`
  display: flex;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

const Finish = observer(() => {
  if (PopUpState.displayFinish) {
    return (
      <Layout>
        <FinishBoard></FinishBoard>
      </Layout>
    );
  } else {
    return <></>;
  }
});

export default Finish;
