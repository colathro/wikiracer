import Card from "./Card";

const Page2 = () => {
  return (
    <>
      <Card
        reversed={false}
        text="First one to the end wins!"
        subtext="Don't worry, everyone gets coins and experience though."
      />
      <Card
        reversed={true}
        text="Wikipedia articles contain references to other article."
        subtext="Think of a spider web, where the web intersects - think of it as a page!"
      />
      <Card
        reversed={false}
        text="Some articles are harder to reach than others."
        subtext="Checkout the leaderboards for the most popular!"
      />
      <Card
        reversed={true}
        text="When the round is over, you can see the route everyone took!"
        subtext="It's fun to see the exact moment someone got lost!"
      />
    </>
  );
};

export default Page2;
