/**
 * The visitor's Be[X] account, signed in on the map (map.4xor.de shares the site
 * with Studio, so its sign-in cookie travels along). Signed in, the demo runs on
 * the account: one run a day per person, unlimited for admins. Asked once per page.
 */
import { useEffect, useState } from "react";
import { MAP_ORIGIN } from "./links.js";

export const MAP_DEMO_API = `${MAP_ORIGIN}/api/studio-demo`;

let pending;
function load() {
  pending ??= fetch(MAP_DEMO_API, { credentials: "include" })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  return pending;
}
/** Forget the cached answer, e.g. after a run used today's quota. */
export const reloadAccount = () => (pending = undefined);

/** null while unknown or signed out; otherwise { signedIn, name, admin, used } */
export function useMapAccount() {
  const [account, setAccount] = useState(null);
  useEffect(() => {
    let live = true;
    load().then((a) => live && setAccount(a?.signedIn ? a : null));
    return () => {
      live = false;
    };
  }, []);
  return account;
}
