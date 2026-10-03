export type Spot = "bird" | "cloud" | "car";

export type WatchState = {
  spots: Spot[];
};

export const EMPTY_WATCH: WatchState = { spots: [] };

const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six"] as const;
const LEFT_WORDS = [
  "No spots left.",
  "One spot left.",
  "Two spots left.",
  "Three spots left.",
  "Four spots left.",
  "Five spots left.",
  "Six spots left.",
] as const;

function count(state: WatchState, spot: Spot): number {
  return state.spots.filter((item) => item === spot).length;
}

export function birdLine(state: WatchState): string {
  return `Bird count ${COUNT_WORDS[count(state, "bird")]}.`;
}

export function cloudLine(state: WatchState): string {
  return `Cloud count ${COUNT_WORDS[count(state, "cloud")]}.`;
}

export function carLine(state: WatchState): string {
  return `Car count ${COUNT_WORDS[count(state, "car")]}.`;
}

export function leftLine(state: WatchState): string {
  return LEFT_WORDS[6 - state.spots.length];
}

export function watchLine(state: WatchState): string {
  const last = state.spots[state.spots.length - 1];
  if (last === "bird") return "A bird.";
  if (last === "cloud") return "A cloud.";
  if (last === "car") return "A car.";
  return "Nothing yet.";
}

export function hasProgress(state: WatchState): boolean {
  return state.spots.length > 0;
}

export function parseWatch(raw: string | null): WatchState {
  if (!raw) return EMPTY_WATCH;
  try {
    const value = JSON.parse(raw) as { spots?: unknown };
    if (!Array.isArray(value.spots) || value.spots.length > 6) return EMPTY_WATCH;
    const spots: Spot[] = [];
    for (const spot of value.spots) {
      if (spot !== "bird" && spot !== "cloud" && spot !== "car") return EMPTY_WATCH;
      spots.push(spot);
    }
    return { spots };
  } catch {
    return EMPTY_WATCH;
  }
}

export function see(state: WatchState, spot: Spot): { state: WatchState; note: string } {
  if (state.spots.length >= 6) return { state, note: "No spots left." };
  return { state: { spots: [...state.spots, spot] }, note: "Spotted." };
}

export function takeBack(state: WatchState): { state: WatchState; note: string } {
  if (state.spots.length === 0) return { state, note: "First spot." };
  return { state: { spots: state.spots.slice(0, -1) }, note: "Spot returned." };
}

export function resetWatch(): { state: WatchState; note: string } {
  return { state: EMPTY_WATCH, note: "Look outside." };
}
