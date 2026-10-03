import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseWatch, type WatchState } from "./watch";

const KEY = "window-watch-v1";

export async function loadWatch(): Promise<WatchState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseWatch(raw);
}

export async function saveWatch(state: WatchState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
