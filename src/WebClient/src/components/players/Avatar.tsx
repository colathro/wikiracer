import { observer } from "mobx-react-lite";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { IPersonaProps, Persona } from "@fluentui/react/lib/Persona";

const customCoinClass = mergeStyles({
  borderRadius: 12,
  display: "block",
});

type props = {
  avatar: string;
};

const Avatar = observer((props: props) => {
  return (
    <Persona
      imageUrl={`/images/avatars/${props.avatar}.png`}
      onRenderCoin={_onRenderCoin}
      coinSize={48}
    />
  );
});

function _onRenderCoin(props: IPersonaProps | undefined): JSX.Element {
  const { coinSize, imageAlt, imageUrl } = props!;
  return (
    <img
      src={imageUrl}
      alt={imageAlt}
      width={coinSize}
      height={coinSize}
      className={customCoinClass}
    />
  );
}

export default Avatar;
