import { Vector3 } from "three";

/**
 * A load hanging under a moving point. A pendulum, not a spring: a shorter cable swings faster, it
 * can only swing so far out, and it rises as it does. `steady` (0..1) damps it hard, the way an
 * operator waits out the swing before setting a load down.
 */
export function createPendulum() {
  const hanging = new Vector3();
  const swing = new Vector3();
  const velocity = new Vector3();
  let settled = false;

  return {
    step(from: Vector3, length: number, steady: number, dt: number): Vector3 {
      hanging.set(from.x, from.y - length, from.z);
      if (!settled) {
        swing.copy(hanging);
        settled = true;
      }
      const cable = Math.max(0.25, length);
      const k = 9.8 / (cable + 0.5) + steady * 14;
      const damp = 1.6 + steady * 9;
      velocity.x += ((hanging.x - swing.x) * k - velocity.x * damp) * dt;
      velocity.z += ((hanging.z - swing.z) * k - velocity.z * damp) * dt;
      swing.x += velocity.x * dt;
      swing.z += velocity.z * dt;
      let dx = swing.x - hanging.x;
      let dz = swing.z - hanging.z;
      const out = Math.hypot(dx, dz);
      const most = cable * 0.6;
      if (out > most) {
        dx *= most / out;
        dz *= most / out;
        swing.x = hanging.x + dx;
        swing.z = hanging.z + dz;
        velocity.multiplyScalar(0.8);
      }
      swing.y = from.y - Math.sqrt(Math.max(0, cable * cable - dx * dx - dz * dz));
      return swing;
    },
  };
}
