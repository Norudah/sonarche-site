import { WebGLRenderer } from "three";

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/**
 * A transparent renderer, or null when WebGL is missing or runs on the CPU: a software rasteriser
 * spends seconds per frame at this fill rate and blocks the page doing it.
 */
export function createRenderer(canvas: HTMLCanvasElement, antialias: boolean, onShaderError: () => void) {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias, powerPreference: "high-performance" });
  } catch {
    return null;
  }

  if (isSoftware(renderer)) {
    renderer.dispose();
    renderer.forceContextLoss();
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  // A shader that fails to compile renders nothing and only says so in the console.
  renderer.debug.onShaderError = (gl, program) => {
    if (process.env.NODE_ENV !== "production") console.error(gl.getProgramInfoLog(program));
    onShaderError();
  };
  return renderer;
}

function isSoftware(renderer: WebGLRenderer): boolean {
  const gl = renderer.getContext();
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  return typeof name === "string" && SOFTWARE.test(name);
}
