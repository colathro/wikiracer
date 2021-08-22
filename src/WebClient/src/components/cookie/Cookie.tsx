import styled from "styled-components";
import { Text } from "@fluentui/react";
import CookieClicker from "./CookieClicker";

const BigLayout = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  max-width: 1000px;
`;

const Cookie = () => {
  return (
    <BigLayout>
      <Text>
        <Text variant="xxLarge">Cookie Policy</Text>
        <Text variant="small">Rev. July 2021</Text>
        <p>
          Honestly, we don't really know what a cookie policy is. Big sites seem
          to have it and we think it's because they don't really know what it is
          either. Having the cookie policy does make us look pretty legit, so if
          you're actually a legal team looking to extort us for money (not just
          a curious gamer), we'll atleast go over what cookies we use below.
        </p>
        <p>
          Basically, we just have two cookies today. ARRAffinitySameSite and
          ARRAffinity. Don't worry, technically speaking, these do track you;
          but only to make our game work.
        </p>
        <p>
          We've spent a ton of time making this scalable, and as such, need to
          have multiple servers. Our game is realtime, so you need an active
          socket connection when in the lobby. This socket connection is
          basically what makes the chat realtime and other changes happen so
          quickly. And because we can have multiple servers, we need to know
          which one you were at to re-establish your connection if it fails. If
          you goto the wrong one, we won't have all the information to get you
          exactly where you left off.
        </p>
        <p>
          Because we feel bad that our cookie policy is so short, here is a game
          within a game inspired by cookie policies and cult classic Cookie
          Clicker.
        </p>
      </Text>
      <CookieClicker></CookieClicker>
    </BigLayout>
  );
};

export default Cookie;
