import type { AspectRatio } from './AspectRatio';
import type { CameraAngle } from './CameraAngle';

export interface Composition {
  readonly aspectRatio: AspectRatio;
  readonly cameraAngle: CameraAngle;
  readonly shot: 'close-up' | 'medium-close' | 'medium' | 'wide';
  readonly safeZone: string;
  readonly negativeSpace: string;
}
