import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import PopUpState from "../../state/PopUpState";

const Layout = styled.div`
  position: absolute;
  display: flex;
`;

const Message = observer(() => {
  return <Layout>test</Layout>;
});

export default Message;
