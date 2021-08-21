import { action } from "mobx";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import LobbyState from "../../state/LobbyState";

const Button = styled.div`
  display: flex;
  padding: 2em;
  border-radius: 6px;
  background-color: white;
  font-weight: bold;
  align-items: center;
  font-family: sans-serif;
  font: Arial;
  &:hover {
    background-color: lightblue;
    cursor: pointer;
  }
`;

type props = {
  action: any;
};

const PlayNow = observer((props: props) => {
  return (
    <Button
      onClick={() => {
        props.action();
      }}
    >
      PLAY NOW AS GUEST
    </Button>
  );
});

export default PlayNow;
