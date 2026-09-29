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
 * The studio the vessel is shot in.
 *
 * A soft warm key from above-left and in front, a cool lavender rim from
 * behind to lift the silhouette off the pale sky, a hemisphere fill that is
 * paper above and indigo below (the sea's own colour bounced back up), and a
 * room environment for the sheen on the glass eyes and the satin paint.
 *
 * No shadow maps: they cost a compile and a second pass of the whole boat
 * every frame, for crates sitting on a deck. The boat paints its own contact
 * shadows instead (boat/shadows.ts).
 *
 * The environment is the one expensive thing here — its blur shaders compile
 * synchronously — so it is not built with the rest: `environment()` is called
 * in a startup slice of its own, after the first frame, while the reveal is
 * still sweeping and a little extra sheen arriving goes unnoticed.
 *
 * The sea's shaders are their own light (they compute oklch directly and skip
 * tone mapping); this lighting is for the meshes.
 */

export function createLighting(renderer: WebGLRenderer, scene: Scene) {
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  // The hull is cut at the waterline by a clipping plane (boat/waterline.ts).
  renderer.localClippingEnabled = true;

  const fill = new HemisphereLight("#f3f4ff", "#3d4097", 1.3);
  const key = new DirectionalLight("#fff4e6", 2.6);
  const rim = new DirectionalLight("#c7ccff", 1.7);
  scene.add(fill, key, key.target, rim, rim.target);

  let environment: { dispose(): void } | undefined;

  return {
    environment() {
      const pmrem = new PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const target = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 128 });
      scene.environment = target.texture;
      scene.environmentIntensity = 0.55;
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
