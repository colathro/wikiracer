import { observer } from "mobx-react-lite";
import styled from "styled-components";

const Button = styled.div`
  width: 262px;
  display: flex;
  padding: 2em;
  border-radius: 6px;
  background-color: black;
  color: white;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  font: Arial;
  &:hover {
    background-color: grey;
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
      <div>PLAY NOW AS GUEST</div>
    </Button>
  );
});

export default PlayNow;
