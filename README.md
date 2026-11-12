# FullWindowOverlay × Liquid Glass bar buttons repro

Minimal reproduction for `react-native-screens`. On iOS 26+, touches on content inside a `FullWindowOverlay` that covers a native header bar button make that button play its Liquid Glass press/flex animation. The button's action does not fire.

## Run

```sh
npm install
npx expo start
```

Open the project in Expo Go on an iOS 26+ device or simulator. The bug does not show on web.

## Steps

1. With **Show overlay** off, tap the star in the header. The counter increments, so the button works.
2. Turn **Show overlay** on. A translucent overlay now covers the header, star included.
3. Press and hold on the overlay directly over the star.

**Expected.** The overlay handles the touch and the star does not react.

**Actual.** The star's glass swells under the overlay, as if pressed. On release the counter does not change.

All of the code is in [`app/index.tsx`](app/index.tsx). The star sits on the left of the header because Expo Go's dev-tools button covers the right side.

## Environment

- Expo SDK 58, React Native 0.88.1, `react-native-screens` 4.30.1, `expo-router` 58
- New Architecture (Fabric), Hermes
- Reproduced on the iPhone 18 Pro Max simulator, iOS 27.2

## Cause

`FullWindowOverlay` adds its container as a subview of the host `UIWindow`. On iOS 26+, UIKit drives the bar-button glass press effect with `UIPlatformGlassFlexInteraction`. Its `_UIFlexInteractionPanGestureRecognizer` is attached to the `UIWindow`, so it receives every touch in that window, including touches delivered to the overlay. The bar button's own action only fires for touches delivered to the button, so you get the animation without the action.

We confirmed this in LLDB by printing `touch.gestureRecognizers` for a touch on the overlay content. The list included `_UIFlexInteractionPanGestureRecognizer` attached to `UIWindow`, in state Began.

Hosting the overlay container in its own passthrough `UIWindow` on the same scene stops the animation in our testing, because touches on the overlay then belong to a different window.
