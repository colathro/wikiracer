import styled from "styled-components";
import { StoreItem } from "../../types/Store";
import StoreAvatar from "./StoreAvatar";
import { Text, PrimaryButton } from "@fluentui/react";
import { observer } from "mobx-react-lite";
import AuthState from "../../state/AuthState";
import PopUpState from "../../state/PopUpState";

const Card = styled.div`
  width: 180px;
  height: 250px;
  display: flex;
  box-shadow: rgb(0 0 0 / 13%) 0px 3.2px 7.2px 0px,
    rgb(0 0 0 / 11%) 0px 0.6px 1.8px 0px;
  outline: transparent;
  border-radius: 8px;
  margin: 1em;
`;

const CardInner = styled.div`
  display: flex;
  flex: 1;
  margin: 1em;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

type props = {
  item: StoreItem;
  refresh: any;
};

const AvailableItem = observer((props: props) => {
  const unlocked = AuthState.user?.unlockedAvatars!.includes(props.item.name);

  const unlockItem = () => {
    AuthState.unlockItem(() => {
      props.refresh();
      PopUpState.showSuccess("Successfully unlocked new avatar.");
    }, props.item);
  };

  const setAvatar = () => {
    AuthState.setAvatar(() => {
      props.refresh();
      PopUpState.showSuccess("Successfully set avatar.");
    }, props.item.name);
  };
  return (
    <Card>
      <CardInner>
        <StoreAvatar avatar={props.item.name}></StoreAvatar>
        <div>
          {unlocked ? (
            <PrimaryButton
              onClick={() => {
                setAvatar();
              }}
            >
              Use
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={() => {
                unlockItem();
              }}
            >
              Unlock {props.item.price}
            </PrimaryButton>
          )}
        </div>
        <Text variant="large">{props.item.name}</Text>
      </CardInner>
    </Card>
  );
});

export default AvailableItem;
