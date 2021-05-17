import { observer } from "mobx-react-lite";
import AuthState from "./state/AuthState";
import LoginView from "./views/LoginView";
import LoggedInView from "./views/LoggedInView";
import "./App.css";

function App() {
  return (
    <div>
      <LandingView></LandingView>
    </div>
  );
}

const LandingView = observer(() => {
  return (
    <div>{AuthState.auth_info === null ? <LoginView /> : <LoggedInView />}</div>
  );
});

export default App;
