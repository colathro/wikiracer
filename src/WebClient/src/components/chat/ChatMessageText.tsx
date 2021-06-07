import styled from "styled-components";
import ThemeManager from "../../Themes";
import Emotes from "./Emotes";

const Layout = styled.span`
  vertical-align: middle;
`;

const EmoteIcon = styled.img`
  height: 1em;
`;

const Text = styled.span``;

type props = {
  text: string;
};

type Span = {
  type: SpanType;
  info: string;
};

enum SpanType {
  Emote,
  Text,
}

const ChatMessageText = (props: props) => {
  let messages: Span[] = [];
  const splitText = props.text.split(" ");
  let inSpan = false;
  let curSpan = "";

  splitText.forEach((snip) => {
    if (inSpan) {
      const potentialEmote = Emotes.get(snip);
      if (potentialEmote != undefined) {
        inSpan = false;
        messages.push({ info: curSpan, type: SpanType.Text });
        messages.push({ info: " ", type: SpanType.Text });
        messages.push({ info: potentialEmote!, type: SpanType.Emote });
        curSpan = "";
      } else {
        curSpan += " " + snip;
      }
    } else {
      const potentialEmote = Emotes.get(snip);
      if (potentialEmote != undefined) {
        messages.push({ info: " ", type: SpanType.Text });
        messages.push({ info: potentialEmote!, type: SpanType.Emote });
      } else {
        inSpan = true;
        curSpan += " " + snip;
      }
    }
  });

  messages.push({ info: curSpan, type: SpanType.Text });

  return (
    <Layout>
      {messages.map((m, k) => {
        if (m.type === SpanType.Emote) {
          return <EmoteIcon key={k} src={m.info}></EmoteIcon>;
        } else {
          return <Text key={k}>{m.info}</Text>;
        }
      })}
    </Layout>
  );
};

export default ChatMessageText;
