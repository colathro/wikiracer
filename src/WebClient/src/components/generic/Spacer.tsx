type props = {
  height: number;
};

const Spacer = (props: props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: `${props.height}em`,
      }}
    ></div>
  );
};

export default Spacer;
