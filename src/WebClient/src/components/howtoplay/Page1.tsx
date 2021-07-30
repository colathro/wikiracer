import Card from "./Card";

const Page1 = () => {
  return (
    <>
      <Card
        reversed={false}
        text="WikiRacer is a simple game."
        subtext="Depending on how deep you look at it 🧐"
        bunny="/images/bunnies/help/science.png"
      />
      <Card
        reversed={true}
        text="Everyone starts at the same Wikipedia page."
        subtext="Could be anywhere 🌎"
        bunny="/images/bunnies/help/ness.png"
      />
      <Card
        reversed={false}
        text="The goal is to find your way to the finish page!"
        subtext="Easier said than done 😩"
        bunny="/images/bunnies/help/blind.png"
      />
      <Card
        reversed={true}
        text="The host gets to pick the start and finish pages."
        subtext="Although you could sway their decision in the chat 🤬"
        bunny="/images/bunnies/help/nintendo.png"
      />
    </>
  );
};

export default Page1;
