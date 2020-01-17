import { get, keys, set } from "idb-keyval";

function getKey(width: number, height: number, mines: number) {
  return `hs:${width}:${height}:${mines}`;
}

function parseKey(key: string) {
  const [, width, height, mines] = key.split(":").map(Number);
  return { width, height, mines };
}

/**
 * Submit a time. Returns the best time (which will equal `time` if it's a new best time)
 *
 * @param width
 * @param height
 * @param mines
 * @param time
 */
export async function submitTime(
  width: number,
  height: number,
  mines: number,
  time: number
): Promise<number> {
  const key = getKey(width, height, mines);
  const previousBest = await get(key);

  if (typeof previousBest === "number" && time > previousBest) {
    return previousBest;
  }

  // This is technically racy if someone finishes two games at the same time, but… who?
  set(key, time);
  return time;
}

export async function listSizes() {
  const dbKeys = await keys();
  console.log({ dbKeys });
  return dbKeys
    .map(key => parseKey(key as string))
    .filter(({ width }) => !isNaN(width));
}

/** Get best time for a given board */
export function getBest(
  width: number,
  height: number,
  mines: number
): Promise<number | undefined> {
  const key = getKey(width, height, mines);
  return get(key);
}

// Trigger Persistent Storage while we are at it.
// Firefox shows an ugly permission prompt that doesn't really make sense to users, so… nahhhh.
if (
  navigator.storage &&
  navigator.storage.persist &&
  !navigator.userAgent.includes("Firefox/")
) {
  navigator.storage.persist();
}
