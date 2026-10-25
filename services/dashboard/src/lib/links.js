// Where Studio hands over to the rest of 4XOR. One place, so 4xor.de, the map
// and Studio always point at each other the same way.
export const SITE = "https://www.4xor.de";
export const BOOK_URL = `${SITE}/#pricing`;
export const PRODUCT_URL = {
  workflows: `${SITE}/#agent-workflow-automation`,
  social: `${SITE}/#social-media-automation`,
};
export const MAP_URL = "https://map.4xor.de/map";
// The Be[X] map app holds the shared 4XOR sign-in and the live demo API.
export const BEX_URL = import.meta.env.VITE_BEX_URL || "https://map.4xor.de";
