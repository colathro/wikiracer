import { makeAutoObservable } from "mobx";

type Theme = {
  background: string;
  background2: string;
  text: string;
  text2: string;
  text3: string;
  logo: string;
  player: string;
};

const dark: Theme = {
  background: "#202124",
  background2: "#35363a",
  text: "#cccccc",
  text2: "#7891EC",
  text3: "#bdbdbd",
  logo: "darklogo.svg",
  player: "images/dark/player.svg",
};

const light: Theme = {
  background: "#ffffff",
  background2: "#ffffff",
  text: "#000000",
  text2: "#345DF0",
  text3: "#787878",
  logo: "lightlogo.svg",
  player: "images/light/player.svg",
};

class ThemeManager {
  theme: Theme | undefined;

  leftNotifications = false;

  constructor() {
    this.tryGetThemeOverride();
    document.body.style.backgroundColor = this.theme!.background;
    document.body.style.color = this.theme!.text;
    makeAutoObservable(this);
  }

  tryGetThemeOverride() {
    const theme = localStorage.getItem("themeOverride");
    this.theme = light;
    /*     if (theme === null) {
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      if (darkThemeMq.matches) {
        // Theme set to dark.
        this.theme = dark;
      } else {
        // Theme set to light.
        this.theme = light;
      }
    } else {
      // override is set.
      if (theme === "dark") {
        this.theme = dark;
      } else {
        this.theme = light;
      }
    } */
  }

  setDarkOverride() {
    localStorage.setItem("themeOverride", "dark");
    window.location.reload();
  }

  setLightOverride() {
    localStorage.setItem("themeOverride", "light");
    window.location.reload();
  }

  setSystemChosen() {
    localStorage.removeItem("themeOverride");
    window.location.reload();
  }
}

var theme = new ThemeManager();

export default theme;
