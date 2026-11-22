/**
 * Lightweight zero-dependency WebGL architectural grazing-light & fluted-obsidian shader.
 * Renders warm golden-hour caustic ribbons drifting across subtle vertical architectural ridges,
 * responding smoothly to cursor movement and scroll velocity.
 * Automatically pauses when offscreen and renders a single calm frame under prefers-reduced-motion.
 */

const VERT_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 aspect = vec2(u_res.x / max(u_res.y, 1.0), 1.0);
  vec2 p = (uv - 0.5) * aspect;

  // Subtle architectural fluted stone / louver geometry
  float flute = sin(uv.x * 95.0 + sin(uv.y * 2.2) * 0.45) * 0.5 + 0.5;
  float fluteShade = mix(0.88, 1.08, pow(flute, 1.6));

  // Organic slow-drifting architectural daylight caustics
  float t = u_time * 0.14;
  vec2 mOffset = (u_mouse - 0.5) * 0.35;
  vec2 q = vec2(
    fbm(p * 1.45 + vec2(t * 0.6, -t * 0.35) - mOffset * 0.5),
    fbm(p * 1.45 + vec2(4.2 - t * 0.4, 1.7 + t * 0.25) + mOffset * 0.4)
  );
  float beamField = fbm(p * 1.9 + 1.85 * q + vec2(0.0, u_scroll * 0.45));

  // Diagonal architectural sunbeam slash across the gallery wall
  float diag = dot(p - vec2(0.08, -0.04) - mOffset * 0.6, normalize(vec2(0.62, 0.78)));
  float sunBand = exp(-diag * diag * 5.2);

  // Soft cursor-driven grazing spotlight
  vec2 mp = (u_mouse - 0.5) * aspect;
  float dist = length(p - mp);
  float cursorGlow = exp(-dist * dist * 4.8);

  // Palette: Gallery Obsidian (#0A0A0B), Deep Obsidian (#111526), Sacred Gold (#D4AF37), Warm Ivory
  vec3 obsidian = vec3(0.039, 0.039, 0.043);
  vec3 deepSlate = vec3(0.067, 0.082, 0.149);
  vec3 warmBronze = vec3(0.45, 0.34, 0.16);
  vec3 sacredGold = vec3(0.831, 0.686, 0.216);

  vec3 col = mix(obsidian, deepSlate, smoothstep(0.25, 0.85, beamField) * 0.62);

  // Grazing golden-hour light across the fluted wall
  float lightStrength = (sunBand * 0.44 + cursorGlow * 0.34) * smoothstep(0.32, 0.88, beamField);
  col += warmBronze * lightStrength * 0.72 * fluteShade;
  col += sacredGold * pow(max(lightStrength, 0.0), 1.95) * 0.52 * fluteShade;

  // Fine mineral plaster grain
  float grain = (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.022;
  col += grain;

  // Architectural vignette so typography stays razor-legible
  float vig = smoothstep(1.22, 0.24, length(p * vec2(0.88, 1.05)));
  col *= mix(0.52, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function mountHeroShader(canvas: HTMLCanvasElement, reducedMotion: boolean): () => void {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return () => {};

  const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) return () => {};

  const prog = gl.createProgram();
  if (!prog) return () => {};
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {};
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uScroll = gl.getUniformLocation(prog, 'u_scroll');

  let targetX = 0.62;
  let targetY = 0.46;
  let curX = targetX;
  let curY = targetY;
  let scrollVal = 0;
  let visible = true;
  let rafId = 0;
  const start = performance.now();

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const render = (now: number) => {
    if (!visible) return;
    curX += (targetX - curX) * 0.045;
    curY += (targetY - curY) * 0.045;
    const elapsed = (now - start) * 0.001;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uMouse, curX, 1.0 - curY);
    gl.uniform1f(uScroll, scrollVal);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!reducedMotion) {
      rafId = requestAnimationFrame(render);
    }
  };

  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    targetX = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    targetY = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
  };

  const onScroll = () => {
    scrollVal = Math.min(1.5, window.scrollY / Math.max(window.innerHeight, 1));
  };

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible && !reducedMotion) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(render);
      }
    },
    { threshold: 0.01 }
  );

  resize();
  io.observe(canvas);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  rafId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(rafId);
    io.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', onScroll);
  };
}
