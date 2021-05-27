import ThemeManager from "../../Themes";

const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
      <button
        onClick={() => {
          ThemeManager.setLightOverride();
        }}
      >
        Light Mode
      </button>
      <button
        onClick={() => {
          ThemeManager.setDarkOverride();
        }}
      >
        Dark Mode
      </button>
    </div>
  );
};

export default Settings;
