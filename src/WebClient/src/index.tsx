import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { loadTheme } from "@fluentui/style-utilities";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

initializeIcons();

loadTheme({
  palette: {
    themePrimary: "#3366cc",
    themeLighterAlt: "#f5f8fd",
    themeLighter: "#d9e3f7",
    themeLight: "#baccf0",
    themeTertiary: "#7b9de0",
    themeSecondary: "#4776d2",
    themeDarkAlt: "#2e5cb8",
    themeDark: "#274e9b",
    themeDarker: "#1d3972",
    neutralLighterAlt: "#faf9f8",
    neutralLighter: "#f3f2f1",
    neutralLight: "#edebe9",
    neutralQuaternaryAlt: "#e1dfdd",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c6c4",
    neutralTertiary: "#a19f9d",
    neutralSecondary: "#605e5c",
    neutralPrimaryAlt: "#3b3a39",
    neutralPrimary: "#323130",
    neutralDark: "#201f1e",
    black: "#000000",
    white: "#ffffff",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
