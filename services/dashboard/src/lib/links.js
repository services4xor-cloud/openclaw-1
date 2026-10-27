// Where Studio hands over to the rest of 4XOR. One place, so 4xor.de, the map
// and Studio always point at each other the same way.
import { siteHome } from "./i18n.jsx";
import { chromeFor } from "./site-chrome.js";

export const PRODUCT_ANCHOR = {
  workflow: "agent-workflow-automation",
  social: "social-media-automation",
};
/** The service on 4xor.de, in the visitor's language (where "Request this service" lives). */
export const productUrl = (flow, lang) => `${siteHome(lang)}#${PRODUCT_ANCHOR[flow]}`;
/** The free intro call: the booking calendar, the same as 4xor.de's button. */
export const bookUrl = (lang) => chromeFor(lang).cta.href;
export const MAP_ORIGIN = import.meta.env.VITE_MAP_ORIGIN || "https://map.4xor.de";
export const MAP_URL = `${MAP_ORIGIN}/map`;
/** The privacy notice that covers the live demo: what happens to the entries. */
export const PRIVACY_URL = `${MAP_ORIGIN}/privacy#what`;
/** Demos open to visitors. Agent Workflow Automation stays hidden until Tobias enables it. */
export const LIVE_FLOWS = ["social"];
/** The map with this service in focus, so the agent answers about it. */
const MAP_CODE = { workflow: "4xor-workflow-automation", social: "4xor-social-media-automation" };
export const mapAgentUrl = (flow) => `${MAP_URL}?select=${MAP_CODE[flow]}&country=CH`;
