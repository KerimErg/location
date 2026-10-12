// Procedural, original car models for TestLocation (no third-party assets).
// Each body type is defined by a side profile extruded across the width.
import * as THREE from "three";

const PROFILES = {
  // [length, height, width, wheelRadius, wheelbaseFront, wheelbaseRear] + profile points (x along length, y up)
  citadine: {
    width: 1.72, wheelR: 0.31, wheelX: [1.18, -1.2], ground: 0.14,
    body: [[-1.78,0.32],[-1.86,0.62],[-1.8,0.88],[-1.55,1.0],[-1.25,1.46],[0.25,1.5],[0.85,1.02],[1.65,0.86],[1.82,0.7],[1.84,0.36],[1.6,0.22],[-1.6,0.22]],
    glass: [[-1.5,1.02],[-1.22,1.42],[0.22,1.45],[0.75,1.04]],
  },
  berline: {
    width: 1.84, wheelR: 0.34, wheelX: [1.45, -1.42], ground: 0.13,
    body: [[-2.35,0.36],[-2.42,0.66],[-2.3,0.86],[-1.75,0.94],[-1.2,1.36],[0.35,1.4],[1.05,0.98],[2.05,0.82],[2.32,0.64],[2.36,0.38],[2.1,0.22],[-2.1,0.22]],
    glass: [[-1.68,0.97],[-1.16,1.32],[0.32,1.35],[0.95,1.0]],
  },
  suv: {
    width: 1.92, wheelR: 0.4, wheelX: [1.42, -1.4], ground: 0.2,
    body: [[-2.25,0.42],[-2.32,0.82],[-2.22,1.12],[-2.0,1.66],[0.45,1.7],[1.1,1.2],[2.05,1.06],[2.3,0.86],[2.32,0.46],[2.05,0.28],[-2.05,0.28]],
    glass: [[-1.95,1.18],[-1.88,1.6],[0.42,1.64],[1.0,1.22]],
  },
  utilitaire: {
    width: 2.0, wheelR: 0.37, wheelX: [1.65, -1.55], ground: 0.18,
    body: [[-2.6,0.4],[-2.62,2.25],[0.95,2.28],[1.55,1.4],[2.35,1.12],[2.5,0.85],[2.52,0.45],[2.25,0.26],[-2.4,0.26]],
    glass: [[0.9,1.55],[0.95,2.12],[1.08,2.12],[1.48,1.42]],
  },
  premium: {
    width: 1.92, wheelR: 0.36, wheelX: [1.55, -1.45], ground: 0.11,
    body: [[-2.35,0.38],[-2.4,0.72],[-2.2,0.88],[-1.5,0.96],[-0.75,1.26],[0.25,1.28],[1.15,0.9],[2.15,0.74],[2.4,0.56],[2.42,0.34],[2.15,0.2],[-2.15,0.2]],
    glass: [[-1.35,0.98],[-0.72,1.21],[0.22,1.23],[1.02,0.92]],
  },
  electrique: {
    width: 1.88, wheelR: 0.35, wheelX: [1.48, -1.45], ground: 0.14,
    body: [[-2.3,0.38],[-2.36,0.74],[-2.15,0.94],[-1.6,1.12],[-0.9,1.44],[0.3,1.46],[1.15,1.0],[2.15,0.8],[2.33,0.6],[2.35,0.38],[2.1,0.22],[-2.1,0.22]],
    glass: [[-1.45,1.14],[-0.86,1.39],[0.28,1.41],[1.05,1.02]],
  },
};

function smooth(points) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, "catmullrom", 0.12);
  return curve.getPoints(240).slice(0, -1).map((p) => [p.x, p.y]);
}

// Clip a closed polygon against the half-plane y >= h (above=true) or y <= h.
function clip(poly, h, above) {
  const inside = (p) => (above ? p[1] >= h : p[1] <= h);
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const ia = inside(a), ib = inside(b);
    if (ia) out.push(a);
    if (ia !== ib) {
      const t = (h - a[1]) / (b[1] - a[1]);
      out.push([a[0] + t * (b[0] - a[0]), h]);
    }
  }
  return out;
}

function shapeFrom(poly) {
  const s = new THREE.Shape();
  poly.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  return s;
}

function extrude(poly, width, bevel, size) {
  const g = new THREE.ExtrudeGeometry(shapeFrom(poly), { depth: width - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: size, bevelSegments: 8, curveSegments: 12 });
  g.translate(0, 0, -(width - bevel * 2) / 2);
  g.computeVertexNormals();
  return g;
}

function wheel(r, width, rimMat, tireMat) {
  const g = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(r, r, width, 48, 1), tireMat);
  tire.rotation.x = Math.PI / 2;
  g.add(tire);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.68, r * 0.68, width + 0.02, 40), rimMat);
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  for (let i = 0; i < 5; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(r * 1.25, r * 0.12, width + 0.04), rimMat);
    spoke.rotation.z = (i / 5) * Math.PI;
    g.add(spoke);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.16, r * 0.16, width + 0.06, 24), tireMat);
  hub.rotation.x = Math.PI / 2;
  g.add(hub);
  return g;
}

export function buildCar(type = "premium", color = "#FF5F00") {
  const p = PROFILES[type];
  const car = new THREE.Group();
  car.name = `TestLocation_${type}`;

  const paint = new THREE.MeshPhysicalMaterial({ name: "Paint", color, metalness: 0.6, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.06 });
  const glassMat = new THREE.MeshPhysicalMaterial({ name: "Glass", color: "#0b0d10", metalness: 0.9, roughness: 0.05, clearcoat: 1 });
  const trim = new THREE.MeshStandardMaterial({ name: "Trim", color: "#111214", metalness: 0.4, roughness: 0.55 });
  const tireMat = new THREE.MeshStandardMaterial({ name: "Tire", color: "#151515", metalness: 0, roughness: 0.9 });
  const rimMat = new THREE.MeshStandardMaterial({ name: "Rim", color: "#c9ccd1", metalness: 1, roughness: 0.22 });
  const headMat = new THREE.MeshStandardMaterial({ name: "Headlight", color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 2 });
  const tailMat = new THREE.MeshStandardMaterial({ name: "Taillight", color: "#ff2a1a", emissive: "#ff2a1a", emissiveIntensity: 1.6 });

  const W = p.width;
  const outline = smooth(p.body);
  const belt = Math.min(...p.glass.map((q) => q[1])) - 0.02;
  const roofY = Math.max(...outline.map((q) => q[1]));

  // Lower body (below the beltline), full width
  const lower = new THREE.Mesh(extrude(clip(outline, belt, false), W, 0.12, 0.08), paint);
  lower.position.y = p.ground;
  car.add(lower);

  // Greenhouse: tinted glass, narrower for tumblehome
  const cabinPoly = clip(outline, belt - 0.08, true);
  const cabin = new THREE.Mesh(extrude(cabinPoly, W - 0.3, 0.1, 0.04), glassMat);
  cabin.position.y = p.ground;
  car.add(cabin);

  // Painted roof panel + pillars
  const roofPoly = clip(cabinPoly, roofY - 0.06, true);
  if (roofPoly.length > 2) {
    const roof = new THREE.Mesh(extrude(roofPoly, W - 0.26, 0.06, 0.03), type === "premium" ? glassMat : paint);
    roof.position.y = p.ground + 0.012;
    car.add(roof);
  }
  const cx = cabinPoly.map((q) => q[0]);
  const bx = (Math.min(...cx) + Math.max(...cx)) / 2 + 0.05;
  for (const side of [-1, 1]) {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.1, roofY - belt, 0.02), paint);
    pillar.position.set(bx, p.ground + (roofY + belt) / 2 - 0.04, side * ((W - 0.3) / 2 + 0.005));
    car.add(pillar);
  }

  // Lower trim / skirt
  const xs = outline.map((q) => q[0]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(maxX - minX - 0.3, 0.1, W + 0.02), trim);
  skirt.position.set((maxX + minX) / 2, p.ground + 0.24, 0);
  car.add(skirt);

  // Lights
  const front = maxX + 0.09, rear = minX - 0.09;
  for (const z of [-W / 2 + 0.28, W / 2 - 0.28]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.42), headMat);
    hl.position.set(front - 0.06, p.ground + (type === "utilitaire" ? 0.82 : type === "suv" ? 0.86 : 0.66), z);
    car.add(hl);
  }
  const lightY = p.ground + (type === "utilitaire" ? 0.82 : type === "suv" ? 0.86 : 0.66);
  const drl = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, W - 0.5), headMat);
  drl.position.set(front - 0.03, lightY + 0.07, 0);
  car.add(drl);
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, W - 0.7), trim);
  grille.position.set(front - 0.02, p.ground + 0.34, 0);
  car.add(grille);
  const tl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, W - 0.2), tailMat);
  tl.position.set(rear + 0.02, p.ground + (type === "utilitaire" ? 0.95 : type === "suv" ? 1.0 : 0.78), 0);
  car.add(tl);

  // Wheels + arches
  const tw = 0.26;
  for (const x of p.wheelX) {
    for (const side of [-1, 1]) {
      const w = wheel(p.wheelR, tw, rimMat, tireMat);
      w.position.set(x, p.wheelR, side * (W / 2 - tw / 2 + 0.07));
      car.add(w);
      const arch = new THREE.Mesh(new THREE.TorusGeometry(p.wheelR + 0.07, 0.035, 8, 40, Math.PI), trim);
      arch.position.set(x, p.wheelR, side * (W / 2 + 0.005));
      car.add(arch);
    }
  }
  // Accent line (brand signature)
  const accent = new THREE.Mesh(new THREE.BoxGeometry(maxX - minX - 1.0, 0.018, W + 0.03), new THREE.MeshStandardMaterial({ name: "Accent", color: "#e6e8eb", metalness: 1, roughness: 0.2 }));
  accent.position.set((maxX + minX) / 2, p.ground + 0.52, 0);
  car.add(accent);

  car.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return car;
}

export const TYPES = Object.keys(PROFILES);
