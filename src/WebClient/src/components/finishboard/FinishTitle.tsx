import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import PopUpState from "../../state/PopUpState";

const FinishWrapper = styled.div`
  display: flex;
`;

const FinishTitle = observer(() => {
  return <FinishWrapper>Congrats!</FinishWrapper>;
});

export default FinishTitle;
