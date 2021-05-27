import styled from "styled-components";
import ThemeManager from "../../Themes";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Logo = () => {
  return (
    <Layout>
      <img src={"/images/" + ThemeManager.theme?.logo}></img>
    </Layout>
  );
};

export default Logo;
