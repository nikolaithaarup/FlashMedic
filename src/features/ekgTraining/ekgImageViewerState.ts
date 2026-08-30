export type EkgImageRotation = 0 | 90 | 180 | 270;

export type EkgImageViewState = {
  rotation: EkgImageRotation;
  scale: number;
  panX: number;
  panY: number;
};

export const MIN_EKG_IMAGE_SCALE = 1;
export const MAX_EKG_IMAGE_SCALE = 5;

export function createDefaultEkgImageViewState(): EkgImageViewState {
  return {
    rotation: 0,
    scale: MIN_EKG_IMAGE_SCALE,
    panX: 0,
    panY: 0,
  };
}

export function nextEkgImageRotation(
  rotation: EkgImageRotation,
): EkgImageRotation {
  return ((rotation + 90) % 360) as EkgImageRotation;
}

export function clampEkgImageScale(scale: number) {
  return Math.min(MAX_EKG_IMAGE_SCALE, Math.max(MIN_EKG_IMAGE_SCALE, scale));
}

export function rotateEkgImageViewState(
  state: EkgImageViewState,
): EkgImageViewState {
  return {
    ...state,
    rotation: nextEkgImageRotation(state.rotation),
    panX: 0,
    panY: 0,
  };
}
