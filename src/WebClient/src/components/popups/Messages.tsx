import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import PopUpState from "../../state/PopUpState";

const Layout = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const Messages = observer(() => {
  return <Layout>test</Layout>;
});

export default Messages;
