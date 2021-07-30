import Card from "./Card";

const Page3 = () => {
  return (
    <>
      <Card
        reversed={false}
        text="You earn experience and coins at the end of each round!"
        subtext="The more people you play with, the more you earn!"
        bunny="/images/help/science.png"
      />
      <Card
        reversed={true}
        text="Use the table of contents at the start of the article to jump to sections quickly!"
        subtext="Gotta go fast!"
        bunny="/images/help/science.png"
      />
      <Card
        reversed={false}
        text="Sometimes articles are a dead end, don't worry just use the reset button!"
        subtext="It happens to the best of us!"
        bunny="/images/help/science.png"
      />
      <Card
        reversed={true}
        text="Sometimes the article you least expect are the fastest routes!"
        subtext="You'll be suprised how related seemingly unrelated topics can be!"
        bunny="/images/help/science.png"
      />
    </>
  );
};

export default Page3;
