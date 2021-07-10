import Games from "./Games";
import styled from "styled-components";
import { Text } from "@fluentui/react";

const BigLayout = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  max-height: 80vh;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
`;

const MyStats = () => {
  return (
    <BigLayout>
      <Layout>
        <Title>
          <img
            src="/images/bunnies/stats.png"
            style={{ height: "400px", width: "400px" }}
          ></img>
        </Title>
        <Title>
          <Text variant="xxLargePlus">Game History</Text>
        </Title>
        <Games></Games>
      </Layout>
    </BigLayout>
  );
};

export default MyStats;
