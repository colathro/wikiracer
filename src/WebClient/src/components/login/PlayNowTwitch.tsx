import { observer } from "mobx-react-lite";
import styled from "styled-components";

const Button = styled.div`
  width: 262px;
  display: flex;
  padding: 2em;
  border-radius: 6px;
  background-color: #6441a5;
  color: white;
  font-weight: bold;
  align-items: center;
  justify-content: space-evenly;
  font-family: sans-serif;
  font: Arial;
  &:hover {
    background-color: #977dc7;
    cursor: pointer;
  }
`;

const Twitch = styled.img`
  height: 4em;
  width: 4em;
`;

type props = {
  action: any;
};

const PlayNowTwitch = observer((props: props) => {
  return (
    <Button
      onClick={() => {
        props.action();
      }}
    >
      <div>
        <Twitch src="/images/TwitchGlitchWhite.svg"></Twitch>
      </div>
      <div>PLAY NOW WITH TWITCH</div>
    </Button>
  );
});

export default PlayNowTwitch;
