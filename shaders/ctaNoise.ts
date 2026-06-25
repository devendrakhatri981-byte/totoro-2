// GLSL vertex shader — passed through r3f/drei shaderMaterial
export const ctaVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// GLSL fragment shader — organic animated forest noise
export const ctaFragmentShader = `
uniform float uTime;
uniform vec2  uResolution;
varying vec2  vUv;

// Classic 2D hash
float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// Smooth 2D value noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f); // Hermite interp
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Multi-octave fractal Brownian motion
float fbm(vec2 p) {
  float v = 0.0, amp = 0.5, freq = 1.0;
  for (int i = 0; i < 5; i++) {
    v   += amp * noise(p * freq + uTime * 0.04);
    amp *= 0.5;
    freq *= 2.1;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  // Slight warp using fbm
  float warp = fbm(uv * 2.2 + uTime * 0.03);
  float base = fbm(uv * 1.8 + warp * 0.6);

  // Dark forest green & blue palette
  vec3 col1 = vec3(0.04, 0.10, 0.08);  // near-black forest
  vec3 col2 = vec3(0.07, 0.18, 0.14);  // deep forest green
  vec3 col3 = vec3(0.05, 0.12, 0.17);  // deep forest blue

  vec3 color = mix(col1, col2, base);
  color = mix(color, col3, fbm(uv * 2.5 - uTime * 0.02) * 0.6);

  // Vignette
  float vignette = smoothstep(0.9, 0.3, length(uv - 0.5) * 1.5);
  color *= vignette * 0.7 + 0.3;

  gl_FragColor = vec4(color, 1.0);
}
`;
