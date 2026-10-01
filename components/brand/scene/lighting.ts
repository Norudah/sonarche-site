import {
  DirectionalLight,
  HemisphereLight,
  NeutralToneMapping,
  PMREMGenerator,
  type Object3D,
  type Scene,
  type WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * For the meshes only; the sea's shaders compute their own colour. No shadow maps (the boat paints
 * contact shadows). The room environment's blur compiles synchronously, so `environment()` runs in
 * its own startup slice after the first frame.
 */

export function createLighting(renderer: WebGLRenderer, scene: Scene) {
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  // The hull is cut at the waterline by a clipping plane (boat/waterline.ts).
  renderer.localClippingEnabled = true;

  const fill = new HemisphereLight("#f3f4ff", "#3d4097", 0.95);
  const key = new DirectionalLight("#fff4e6", 3.1);
  const rim = new DirectionalLight("#c7ccff", 1.7);
  scene.add(fill, key, key.target, rim, rim.target);

  let environment: { dispose(): void } | undefined;

  return {
    environment() {
      const pmrem = new PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const target = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 128 });
      scene.environment = target.texture;
      scene.environmentIntensity = 0.7;
      room.dispose();
      pmrem.dispose();
      environment = target;
    },
    /** Keep the key and the rim on the boat as it patrols. */
    follow(boat: Object3D) {
      key.target.position.set(boat.position.x, 1, 0);
      key.position.set(boat.position.x - 7, 14, 11);
      rim.target.position.set(boat.position.x, 1, 0);
      rim.position.set(boat.position.x + 5, 7, -12);
    },
    dispose() {
      environment?.dispose();
    },
  };
}
