import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  birdLine,
  carLine,
  cloudLine,
  EMPTY_WATCH,
  hasProgress,
  leftLine,
  resetWatch,
  see,
  takeBack,
  watchLine,
  type Spot,
  type WatchState,
} from "./src/watch";
import { loadWatch, saveWatch } from "./src/store";

export default function App() {
  const [state, setState] = useState<WatchState>(EMPTY_WATCH);
  const [note, setNote] = useState("Look outside.");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadWatch()
      .then((loaded) => {
        if (!alive) return;
        setState(loaded);
        setNote(hasProgress(loaded) ? "Saved watch loaded." : "Look outside.");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the watch.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveWatch(state).catch(() => setNote("Could not save the watch."));
  }, [ready, state]);

  if (!ready && note === "Look outside.") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the watch</Text>
        </View>
      </SafeAreaView>
    );
  }

  function onSee(spot: Spot) {
    const result = see(state, spot);
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onBack() {
    const result = takeBack(state);
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Window Watch</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{birdLine(state)}</Text>
        <Text style={styles.count}>{cloudLine(state)}</Text>
        <Text style={styles.count}>{carLine(state)}</Text>
        <Text style={styles.count}>{leftLine(state)}</Text>
        <Text style={styles.line}>{watchLine(state)}</Text>
        <View style={styles.row}>
          <BigButton label="Saw a bird" inRow onPress={() => onSee("bird")} />
          <BigButton label="Saw a cloud" inRow onPress={() => onSee("cloud")} />
        </View>
        <BigButton label="Saw a car" onPress={() => onSee("car")} />
        <BigButton label="Take back" onPress={onBack} />
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New watch" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetWatch();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New watch canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7FB" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#1E293B" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 6 },
  title: { fontSize: 32, fontWeight: "800", color: "#1E293B" },
  note: { fontSize: 18, color: "#475569", minHeight: 24 },
  count: { fontSize: 18, fontWeight: "700", color: "#1E293B" },
  line: { fontSize: 36, fontWeight: "800", color: "#0369A1", lineHeight: 42 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#1E293B" },
  buttonText: { fontSize: 18, fontWeight: "800", color: "#1E293B", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
