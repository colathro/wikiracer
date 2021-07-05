import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ThemeManager from "../../Themes";
import PopUpState from "../../state/PopUpState";
import Message from "../popups/Message";

const Layout = styled.div`
  pointer-events: none;
  display: flex;
  flex-direction: column-reverse;
  position: fixed;
  height: 100vh;
  right: 0px;
`;

const Messages = observer(() => {
  const theme = {
    leftNotification: ThemeManager.leftNotifications,
  };
  return (
    <Layout theme={theme}>
      {PopUpState.messages.map((message, index) => {
        return <Message key={index} message={message} num={index} />;
      })}
    </Layout>
  );
});

export default Messages;
