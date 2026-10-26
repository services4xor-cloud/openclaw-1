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
const MAP_ORIGIN = import.meta.env.VITE_MAP_ORIGIN || "https://map.4xor.de";
export const MAP_URL = `${MAP_ORIGIN}/map`;
/** The map with this service in focus, so the agent answers about it. */
const MAP_CODE = { workflow: "4xor-workflow-automation", social: "4xor-social-media-automation" };
export const mapAgentUrl = (flow) => `${MAP_URL}?select=${MAP_CODE[flow]}&country=CH`;
/** Back to the 4xor.de page that sent the visitor (the service card when it came from one). */
export function backTo4xor(lang, flow) {
  let fromSite = false;
  try {
    fromSite = /(^|\.)4xor\.de$/.test(new URL(document.referrer).hostname) && !document.referrer.includes("studio.");
  } catch {}
  return fromSite && flow ? productUrl(flow, lang) : siteHome(lang);
}
