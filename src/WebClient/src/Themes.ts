type Theme = {
  background: string;
  background2: string;
  text: string;
  text2: string;
  logo: string;
};

const dark: Theme = {
  background: "#202124",
  background2: "#35363a",
  text: "#cccccc",
  text2: "#7891EC",
  logo: "darklogo.svg",
};

const light: Theme = {
  background: "#ffffff",
  background2: "#ffffff",
  text: "#000000",
  text2: "#345DF0",
  logo: "lightlogo.svg",
};

class ThemeManager {
  theme: Theme | undefined;
  constructor() {
    this.tryGetThemeOverride();
    document.body.style.backgroundColor = this.theme!.background;
    document.body.style.color = this.theme!.text;
  }

  tryGetThemeOverride() {
    const theme = localStorage.getItem("themeOverride");
    if (theme === null) {
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
    }
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
