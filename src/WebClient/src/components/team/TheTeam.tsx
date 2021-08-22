import styled from "styled-components";
import { Text } from "@fluentui/react";

const BigLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1000px;
`;

const Card = styled.div`
  width: 400px;
  height: 500px;
  box-shadow: rgb(0 0 0 / 13%) 0px 3.2px 7.2px 0px,
    rgb(0 0 0 / 11%) 0px 0.6px 1.8px 0px;
  outline: transparent;
  border-radius: 10px;
  margin: 2em;
  display: flex;
  justify-content: center;
`;

const CardInner = styled.div`
  margin: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Picture = styled.img`
  border-radius: 50%;
  height: 300px;
  width: 300px;
`;

const Name = styled.div`
  margin-top: 1em;
  margin-bottom: 0.5em;
`;

const Pronouns = styled.div``;

const Job = styled.div`
  margin: 0.5em;
`;

const TheTeam = () => {
  return (
    <BigLayout>
      <Card>
        <CardInner>
          <Picture src="/images/team/cups.jpeg"></Picture>
          <Name>
            <Text variant="xLargePlus">Cups</Text>
          </Name>
          <Pronouns>
            <Text variant="medium">They/Them</Text>
          </Pronouns>
          <Job>
            <Text variant="large">Designer/Illustrator</Text>
          </Job>
        </CardInner>
      </Card>
      <Card>
        <CardInner>
          <Picture src="/images/team/andrea.jpg"></Picture>
          <Name>
            <Text variant="xLargePlus">Andrea Stoica</Text>
          </Name>
          <Pronouns>
            <Text variant="medium">She/Her</Text>
          </Pronouns>
          <Job>
            <Text variant="large">Designer/Marketing</Text>
          </Job>
        </CardInner>
      </Card>
      <Card>
        <CardInner>
          <Picture src="/images/team/colton.jpg"></Picture>
          <Name>
            <Text variant="xLargePlus">Colton Lathrop</Text>
          </Name>
          <Pronouns>
            <Text variant="medium">He/Him</Text>
          </Pronouns>
          <Job>
            <Text variant="large">Developer</Text>
          </Job>
        </CardInner>
      </Card>
    </BigLayout>
  );
};

export default TheTeam;
