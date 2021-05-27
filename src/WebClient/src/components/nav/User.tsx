import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthState from "../../state/AuthState";
import ThemeManager from "../../Themes";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.h2`
  font-weight: normal;
  margin: 0px;
  margin-bottom: 0.25em;
`;

const Anchor = styled.a`
  color: ${ThemeManager.theme?.text2};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const User = observer(() => {
  const history = useHistory();
  return (
    <Layout>
      <Username>{AuthState.auth_info?.display_name}</Username>
      <ActionGroup>
        <Anchor
          onClick={() => {
            history.push("/settings");
          }}
        >
          Settings
        </Anchor>
        <Anchor
          onClick={() => {
            AuthState.logout();
          }}
        >
          Logout
        </Anchor>
      </ActionGroup>
    </Layout>
  );
});

export default User;
