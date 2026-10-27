import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/montserrat";
// Arabic: loaded only when Arabic text is on the page (unicode-range)
import "@fontsource-variable/noto-sans-arabic";
import "@fontsource-variable/noto-naskh-arabic";
import App from "./App.jsx";
import { LangProvider } from "./lib/i18n.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <App />
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
