// Each section of the B is a pair of nested D-shaped contours. Linking those
// contours makes real apertures: the inside edges are visible as the mark turns.
type Point = [number, number];
type Vertex = [number, number, number];

function bowl(width: number, bottom: number, height: number) {
  const path: Point[] = [];
  let start: Point = [0, .93];
  const curve = (a: Point, b: Point, end: Point, count: number) => {
    for (let i = 0; i < count; i++) {
      const t = i / count, u = 1 - t;
      const at = (axis: 0 | 1) => u**3*start[axis] + 3*u*u*t*a[axis] + 3*u*t*t*b[axis] + t**3*end[axis];
      path.push([at(0)*width - .75, bottom + at(1)*height]);
    }
    start = end;
  };
  curve([0,.98],[.015,1],[.045,1],3);
  curve([.18,1],[.38,1],[.49,1],5);
  curve([.81,1],[1,.84],[1,.51],16);
  curve([1,.19],[.82,0],[.55,0],16);
  curve([.38,0],[.18,0],[.045,0],5);
  curve([.015,0],[0,.02],[0,.07],3);
  curve([0,.28],[0,.72],[0,.93],8);
  return path;
}

export function cutMark() {
  // Eight vertices per contour point describe a thin plate with bevels on both lips.
  const profiles = [bowl(1.53,0,1.16), bowl(1.69,-1.16,1.16)];
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let lobe = 0; lobe < profiles.length; lobe++) {
    const outer = profiles[lobe];
    const cy = lobe ? -.57 : .57;
    const inner: Point[] = outer.map(([x,y]) => [x * .62 + .04, (y - cy)*.56 + cy]);
    const facets = [[0, .009], [.016,.021], [.984,.021], [1,.009], [1,-.009], [.984,-.021], [.016,-.021], [0,-.009]];
    function point(i: number, ring: number): Vertex {
      const [amount,z] = facets[ring];
      return [outer[i][0]*(1-amount)+inner[i][0]*amount, outer[i][1]*(1-amount)+inner[i][1]*amount, z];
    }
    for (let i=0;i<outer.length;i++) {
      const next = (i+1) % outer.length;
      for (let r=0;r<facets.length;r++) {
        const after=(r+1)%facets.length;
        const a=point(i,r), b=point(next,r), c=point(next,after), d=point(i,after);
        const u=a.map((v,k)=>b[k]-v), v=a.map((n,k)=>d[k]-n);
        const normal=[v[1]*u[2]-v[2]*u[1],v[2]*u[0]-v[0]*u[2],v[0]*u[1]-v[1]*u[0]];
        const len=Math.hypot(...normal)||1;
        const first=vertices.length/6;
        for(const p of [a,b,c,d]) vertices.push(...p,normal[0]/len,normal[1]/len,normal[2]/len);
        indices.push(first,first+1,first+2,first,first+2,first+3);
      }
    }
  }
  return { vertices:new Float32Array(vertices), indices:new Uint16Array(indices) };

}
