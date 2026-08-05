import type { ImageScene } from '../entities/ImageScene';

export function assertImageCreationPolicy(scene: ImageScene): void {
  if (!scene.exactTopic.trim() || !scene.primarySubject.trim() || !scene.visibleAction.trim()) {
    throw new Error('IMAGE_CREATION_POLICY_VIOLATION');
  }
}
