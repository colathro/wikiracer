import styled from "styled-components";

type props = {
  height: number;
};

const Spacer = (props: props) => {
  const Layout = styled.div`
    display: flex;
    flex-direction: column;
    height: ${props.height}em;
  `;
  return <Layout></Layout>;
};

export default Spacer;
