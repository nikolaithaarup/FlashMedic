import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from "react-native";

import { Radii } from "../../../../constants/theme";
import {
  clampEkgImageScale,
  createDefaultEkgImageViewState,
  MAX_EKG_IMAGE_SCALE,
  MIN_EKG_IMAGE_SCALE,
  nextEkgImageRotation,
  type EkgImageRotation,
} from "../../ekgTraining/ekgImageViewerState";

type FullscreenEkgImageModalProps = {
  visible: boolean;
  imageSource: any;
  onClose: () => void;
  rotate?: boolean;
};

type Point = { x: number; y: number };
type Size = { width: number; height: number };
type TouchPoint = { pageX: number; pageY: number };

const ZOOM_STEP = 0.5;

function getTouchDistance(touches: readonly TouchPoint[]) {
  if (touches.length < 2) return 0;
  const deltaX = touches[0].pageX - touches[1].pageX;
  const deltaY = touches[0].pageY - touches[1].pageY;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

export default function FullscreenEkgImageModal({
  visible,
  imageSource,
  onClose,
  rotate = true,
}: FullscreenEkgImageModalProps) {
  const { width, height } = useWindowDimensions();
  const initialRotation: EkgImageRotation = rotate ? 90 : 0;
  const [rotation, setRotation] = useState<EkgImageRotation>(initialRotation);
  const [scale, setScale] = useState(MIN_EKG_IMAGE_SCALE);
  const [viewport, setViewport] = useState<Size>({ width, height });
  const viewportValue = useRef<Size>({ width, height });
  const pan = useRef(new Animated.ValueXY()).current;
  const panValue = useRef<Point>({ x: 0, y: 0 });
  const gestureStartPan = useRef<Point>({ x: 0, y: 0 });
  const scaleValue = useRef(MIN_EKG_IMAGE_SCALE);
  const pinchStartDistance = useRef(0);
  const pinchStartScale = useRef(MIN_EKG_IMAGE_SCALE);

  const clampPan = (point: Point, atScale = scaleValue.current) => {
    const maxX = Math.max(
      0,
      (viewportValue.current.width * (atScale - 1)) / 2,
    );
    const maxY = Math.max(
      0,
      (viewportValue.current.height * (atScale - 1)) / 2,
    );
    return {
      x: Math.max(-maxX, Math.min(maxX, point.x)),
      y: Math.max(-maxY, Math.min(maxY, point.y)),
    };
  };

  const updatePan = (point: Point, atScale = scaleValue.current) => {
    const next = clampPan(point, atScale);
    panValue.current = next;
    pan.setValue(next);
  };

  const updateScale = (value: number) => {
    const next = clampEkgImageScale(value);
    scaleValue.current = next;
    setScale(next);
    if (next === MIN_EKG_IMAGE_SCALE) {
      updatePan({ x: 0, y: 0 }, next);
    } else {
      updatePan(panValue.current, next);
    }
  };

  const resetView = () => {
    const defaults = createDefaultEkgImageViewState();
    setRotation(defaults.rotation);
    scaleValue.current = defaults.scale;
    setScale(defaults.scale);
    updatePan({ x: defaults.panX, y: defaults.panY }, defaults.scale);
  };

  const rotateClockwise = () => {
    setRotation((current) => nextEkgImageRotation(current));
    updatePan({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!visible) return;
    setRotation(initialRotation);
    scaleValue.current = MIN_EKG_IMAGE_SCALE;
    setScale(MIN_EKG_IMAGE_SCALE);
    panValue.current = { x: 0, y: 0 };
    pan.setValue({ x: 0, y: 0 });
  }, [imageSource, initialRotation, pan, visible]);

  useEffect(() => {
    const maxX = Math.max(
      0,
      (viewport.width * (scaleValue.current - 1)) / 2,
    );
    const maxY = Math.max(
      0,
      (viewport.height * (scaleValue.current - 1)) / 2,
    );
    const next = {
      x: Math.max(-maxX, Math.min(maxX, panValue.current.x)),
      y: Math.max(-maxY, Math.min(maxY, panValue.current.y)),
    };
    panValue.current = next;
    pan.setValue(next);
  }, [pan, viewport.height, viewport.width]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (event) =>
        event.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponder: (event, gesture) =>
        event.nativeEvent.touches.length >= 2 ||
        Math.abs(gesture.dx) > 3 ||
        Math.abs(gesture.dy) > 3,
      onPanResponderGrant: (event) => {
        gestureStartPan.current = panValue.current;
        const touches = event.nativeEvent.touches as unknown as TouchPoint[];
        pinchStartDistance.current = getTouchDistance(touches);
        pinchStartScale.current = scaleValue.current;
      },
      onPanResponderMove: (event, gesture) => {
        const touches = event.nativeEvent.touches as unknown as TouchPoint[];
        if (touches.length >= 2) {
          const distance = getTouchDistance(touches);
          if (pinchStartDistance.current > 0 && distance > 0) {
            updateScale(
              pinchStartScale.current *
                (distance / pinchStartDistance.current),
            );
          }
          return;
        }
        if (scaleValue.current <= MIN_EKG_IMAGE_SCALE) return;
        updatePan({
          x: gestureStartPan.current.x + gesture.dx,
          y: gestureStartPan.current.y + gesture.dy,
        });
      },
      onPanResponderRelease: () => updatePan(panValue.current),
      onPanResponderTerminate: () => updatePan(panValue.current),
    }),
  ).current;

  const onViewportLayout = (event: LayoutChangeEvent) => {
    const { width: nextWidth, height: nextHeight } = event.nativeEvent.layout;
    const nextViewport = { width: nextWidth, height: nextHeight };
    viewportValue.current = nextViewport;
    setViewport(nextViewport);
  };

  const onWheel = (event: any) => {
    const deltaY = event.nativeEvent?.deltaY ?? event.deltaY ?? 0;
    event.preventDefault?.();
    updateScale(scaleValue.current + (deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
  };

  const rotated = rotation === 90 || rotation === 270;
  const imageFrame = rotated
    ? { width: viewport.height, height: viewport.width }
    : { width: viewport.width, height: viewport.height };
  const wheelProps = Platform.OS === "web" ? ({ onWheel } as any) : {};

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      statusBarTranslucent
      visible={visible}
    >
      <View style={styles.root} testID="ekg-image-viewer">
        <SafeAreaView style={styles.topControls}>
          <Pressable
            accessibilityLabel="Luk billede"
            accessibilityRole="button"
            hitSlop={12}
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.controlPressed,
            ]}
            testID="ekg-image-close-button"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </SafeAreaView>

        <View
          {...panResponder.panHandlers}
          {...wheelProps}
          accessibilityLabel={`EKG-billede, roteret ${rotation} grader, zoom ${Math.round(scale * 100)} procent`}
          accessibilityRole="image"
          onLayout={onViewportLayout}
          style={styles.viewport}
          testID="ekg-image-viewport"
        >
          <Animated.View
            style={[
              styles.panLayer,
              {
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                  { scale },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.imageFrame,
                imageFrame,
                { transform: [{ rotate: `${rotation}deg` }] },
              ]}
            >
              <Animated.Image
                resizeMode="contain"
                source={imageSource}
                style={styles.image}
              />
            </View>
          </Animated.View>
        </View>

        <SafeAreaView style={styles.bottomControls}>
          <Text style={styles.zoomStatus} testID="ekg-image-view-status">
            {Math.round(scale * 100)} % · {rotation}°
          </Text>
          <View style={styles.controlRow}>
            <Pressable
              accessibilityLabel="Zoom ud"
              accessibilityRole="button"
              disabled={scale <= MIN_EKG_IMAGE_SCALE}
              onPress={() => updateScale(scaleValue.current - ZOOM_STEP)}
              style={({ pressed }) => [
                styles.iconControl,
                scale <= MIN_EKG_IMAGE_SCALE && styles.controlDisabled,
                pressed && styles.controlPressed,
              ]}
              testID="ekg-image-zoom-out-button"
            >
              <Text style={styles.iconControlText}>−</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Zoom ind"
              accessibilityRole="button"
              disabled={scale >= MAX_EKG_IMAGE_SCALE}
              onPress={() => updateScale(scaleValue.current + ZOOM_STEP)}
              style={({ pressed }) => [
                styles.iconControl,
                scale >= MAX_EKG_IMAGE_SCALE && styles.controlDisabled,
                pressed && styles.controlPressed,
              ]}
              testID="ekg-image-zoom-in-button"
            >
              <Text style={styles.iconControlText}>＋</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Rotér billede 90 grader med uret"
              accessibilityRole="button"
              onPress={rotateClockwise}
              style={({ pressed }) => [
                styles.textControl,
                pressed && styles.controlPressed,
              ]}
              testID="ekg-image-rotate-button"
            >
              <Text style={styles.textControlText}>Rotér 90°</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Nulstil visning"
              accessibilityRole="button"
              onPress={resetView}
              style={({ pressed }) => [
                styles.textControl,
                pressed && styles.controlPressed,
              ]}
              testID="ekg-image-reset-button"
            >
              <Text style={styles.textControlText}>Nulstil</Text>
            </Pressable>
          </View>
          <Text style={styles.gestureHint}>
            Knib eller brug +/− for zoom. Træk i billedet for at panorere.
          </Text>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  topControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    pointerEvents: "box-none",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginTop: Platform.OS === "android" ? 6 : 0,
    marginRight: 14,
    width: 44,
    height: 44,
    borderRadius: Radii.control,
    backgroundColor: "rgba(0,0,0,0.72)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.32)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: { color: "#fff", fontSize: 24, fontWeight: "700", lineHeight: 24 },
  viewport: { flex: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  panLayer: { alignItems: "center", justifyContent: "center" },
  imageFrame: { alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  bottomControls: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.78)",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 10 : 4,
    gap: 6,
  },
  zoomStatus: { color: "#fff", fontSize: 12, fontWeight: "700", textAlign: "center" },
  controlRow: { flexDirection: "row", justifyContent: "center", gap: 8, flexWrap: "wrap" },
  iconControl: {
    width: 44,
    height: 44,
    borderRadius: Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconControlText: { color: "#fff", fontSize: 24, fontWeight: "700", lineHeight: 26 },
  textControl: {
    minHeight: 44,
    borderRadius: Radii.control,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  textControlText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  controlPressed: { opacity: 0.72 },
  controlDisabled: { opacity: 0.35 },
  gestureHint: { color: "rgba(255,255,255,0.72)", fontSize: 11, textAlign: "center" },
});
