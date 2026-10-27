/**
 * The 4xor.de header and footer as data: navigation groups, languages, booking
 * button, contact and legal links. Copied from https://www.4xor.de/chrome.json,
 * so Studio shows exactly the same site chrome as 4xor.de and the Be[X] map.
 * To refresh: curl -s https://www.4xor.de/chrome.json > src/lib/site-chrome.json
 */
import chrome4xor from "./site-chrome.json";

const chrome = {
  ...chrome4xor,
  languages: chrome4xor.languages,
  lang: chrome4xor.lang,
};

export const siteChrome = chrome;
export const chromeFor = (lang) => chrome.lang[lang] ?? chrome.lang.en;
