import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay } from "react-native-screens";

export default function Repro() {
  const insets = useSafeAreaInsets();
  const [presses, setPresses] = useState(0);
  const [overlayShown, setOverlayShown] = useState(true);

  return (
    <>
      <Stack.Screen options={{ title: "Repro" }} />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="star" onPress={() => setPresses((count) => count + 1)} />
      </Stack.Toolbar>

      <View style={styles.content}>
        <Text style={styles.count}>Bar button presses: {presses}</Text>
        <View style={styles.toggleRow}>
          <Text>Show overlay</Text>
          <Switch value={overlayShown} onValueChange={setOverlayShown} />
        </View>
      </View>

      {overlayShown && (
        <FullWindowOverlay>
          <View style={[styles.overlay, { top: insets.top }]}>
            <Text style={styles.overlayText}>Press and hold here, over the star</Text>
          </View>
        </FullWindowOverlay>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  count: {
    fontSize: 18,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  overlay: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  overlayText: {
    color: "white",
  },
});
