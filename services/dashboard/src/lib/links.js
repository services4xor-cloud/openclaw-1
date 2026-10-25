// Where Studio hands over to the rest of 4XOR. One place, so 4xor.de, the map
// and Studio always point at each other the same way.
import { siteHome } from "./i18n.jsx";

export const PRODUCT_ANCHOR = {
  workflow: "agent-workflow-automation",
  social: "social-media-automation",
};
/** The service on 4xor.de, in the visitor's language (where "Request this service" lives). */
export const productUrl = (flow, lang) => `${siteHome(lang)}#${PRODUCT_ANCHOR[flow]}`;
/** Packages and the free intro call on 4xor.de. */
export const bookUrl = (lang) => `${siteHome(lang)}#pricing`;
export const MAP_URL = "https://map.4xor.de/map";
// The Be[X] map app holds the shared 4XOR sign-in and the live demo API.
export const BEX_URL = import.meta.env.VITE_BEX_URL || "https://map.4xor.de";
