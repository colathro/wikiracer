import { mergeStyles } from "@fluentui/react/lib/Styling";

const customCoinClass = mergeStyles({
  borderRadius: 12,
  display: "block",
  marginTop: "1em",
});

type props = {
  avatar: string;
};

const StoreAvatar = (props: props) => {
  return (
    <img
      src={`/images/avatars/${props.avatar.toLowerCase()}`}
      width={128}
      height={128}
      className={customCoinClass}
    />
  );
};

export default StoreAvatar;
