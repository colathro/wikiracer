import styled from "styled-components";
import ThemeManager from "../../Themes";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 16em;
`;

const Logo = () => {
  return (
    <Layout>
      <img alt="wikiracer logo" src={"/images/wikiracer-dark.png"}></img>
    </Layout>
  );
};

export default Logo;
