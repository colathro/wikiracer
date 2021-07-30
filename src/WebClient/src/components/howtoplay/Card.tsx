import { Text } from "@fluentui/react";
import styled from "styled-components";

const CardContainer = styled.div`
  max-width: 50em;
  min-width: 40em;
  display: flex;
  flex: 1;
  justify-content: space-between;
  min-height: 20em;
  box-shadow: rgb(0 0 0 / 13%) 0px 3.2px 7.2px 0px,
    rgb(0 0 0 / 11%) 0px 0.6px 1.8px 0px;
  outline: transparent;
  margin-bottom: 2em;
`;

const InnerCard = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1em;
`;

const InnerImage = styled.div`
  display: flex;
  flex: 1;
  margin: 1em;
  align-items: center;
  justify-content: center;
`;

const MainText = styled.div`
  max-width: 15em;
`;
const SubText = styled.div`
  margin-top: 3em;
`;

const Image = styled.img`
  max-width: 20em;
`;

type props = {
  text: string;
  subtext: string;
  reversed: boolean;
  bunny: string;
};

const Card = (props: props) => {
  if (props.reversed) {
    return (
      <CardContainer>
        <InnerImage>
          <Image src={props.bunny}></Image>
        </InnerImage>
        <InnerCard>
          <MainText>
            <Text variant="xLarge">{props.text}</Text>
          </MainText>
          <SubText>
            <Text variant="tiny">{props.subtext}</Text>
          </SubText>
        </InnerCard>
      </CardContainer>
    );
  } else {
    return (
      <CardContainer>
        <InnerCard>
          <MainText>
            <Text variant="xLarge">{props.text}</Text>
          </MainText>
          <SubText>
            <Text variant="tiny">{props.subtext}</Text>
          </SubText>
        </InnerCard>
        <InnerImage>
          <Image src={props.bunny}></Image>
        </InnerImage>
      </CardContainer>
    );
  }
};

export default Card;
