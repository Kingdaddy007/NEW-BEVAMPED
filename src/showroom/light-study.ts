/** The drawing is a folio of section cuts. A single seeded score controls their spacing.
 * Each sheet turns a little further than the preceding one. Looking through their
 * openings gives the stack depth; moving sideways separates the individual cuts.
 */
type Point = [number, number, number];

function section(radius: number, spring: number, foot: number): Point[] {
  const points: Point[] = [[-radius, foot, 0], [-radius, spring, 0]];
  for (let i = 1; i <= 48; i++) {
    const a = Math.PI - Math.PI * i / 48;
    points.push([radius * Math.cos(a), spring + radius * Math.sin(a), 0]);
  }
  points.push([radius, foot, 0]);
  return points;
}

export function mountLightStudy(canvas: HTMLCanvasElement, reduced: MediaQueryList) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const ink = ctx;
  const outer = section(1.06, .42, -1.18);
  const inner = section(.78, .36, -1.18).reverse();
  const outline = outer.concat(inner);
  let seed = 40973;
  const random = () => {seed = (Math.imul(seed,1664525) + 1013904223) >>> 0; return seed / 4294967296;};
  const leaves = Array.from({length:82}, (_,i) => {
    const u = i / 81;
    return {u, grain:random(), angle:-.41+1.65*u + .18*Math.sin(2*Math.PI*u)};
  });
  let width=0, height=0, pointerX=0, pointerY=0, gazeX=0, gazeY=0;
  let raf=0, visible=false, previous=0, elapsed=0;
  function draw(){
    ink.clearRect(0,0,width,height);
    const intro=reduced.matches ? 1 : Math.min(1,elapsed/2700);
    const settle=1-Math.pow(1-intro,3);
    const scroll=reduced.matches?0:Math.min(1,window.scrollY/Math.max(1,innerHeight));
    const yaw=-.59+gazeX*.24+(1-settle)*.39+scroll*.16;
    const pitch=.19+gazeY*.105;
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
    const size=Math.min(width*.235,height*.272);
    for(const {u,grain,angle} of leaves){
      const turn=angle+(1-settle)*.64*(u-.5);
      const cs=Math.cos(turn),sn=Math.sin(turn);
      const slide=-(u-.5)*1.24;
      const along=(u-.5)*1.78;
      const lift=.32*Math.sin(u*Math.PI*1.7);
      const coords=outline.map(([x,y])=>{
        const px=x*cs+slide;
        const z=-x*sn+along;
        const vx=px*cy+z*sy;
        const vz=-px*sy+z*cy;
        const vy=(y+lift)*cp+vz*sp;
        const depth=vz*cp-(y+lift)*sp;
        const scale=size*6.8/(7.2-depth*.37);
        // A slight cant makes the exposed page edges catch the side light.
        return [width*.49+(vx*.96+vy*.16)*scale,height*.54+(-vy+vx*.16)*scale];
      });
      const glint=Math.pow(Math.max(0,Math.cos((turn+yaw+.19)*2.0)),7);
      const rim=70+110*glint+53*u+grain*9;
      ink.beginPath();coords.forEach(([x,y],i)=>i ? ink.lineTo(x,y) : ink.moveTo(x,y));ink.closePath();
      const face=ink.createLinearGradient(width*.15,height*.13,width*.74,height*.82);
      face.addColorStop(0,`rgb(${rim*.91},${rim*.81},${rim*.65})`);
      face.addColorStop(.5,`rgb(${rim*.46},${rim*.39},${rim*.32})`);
      face.addColorStop(1,`rgb(${rim*.22},${rim*.20},${rim*.19})`);
      ink.fillStyle=face;ink.fill();
      ink.strokeStyle=`rgba(${Math.min(253,rim+62)},${Math.min(246,rim+42)},${rim+12},.92)`;
      ink.lineWidth=Math.max(.55,width/1100);ink.stroke();
    }
    canvas.classList.add('ready');
  }
  function frame(now:number){
    raf=0;
    if(!visible || document.hidden)return;
    elapsed+=previous?Math.min(now-previous,60):0;previous=now;
    gazeX+=(pointerX-gazeX)*.08;gazeY+=(pointerY-gazeY)*.08;
    draw();
    if(!reduced.matches && (elapsed<2800 || Math.abs(pointerX-gazeX)+Math.abs(pointerY-gazeY)>.003))raf=requestAnimationFrame(frame);
  }
  function wake(){
    if(!raf && visible && !document.hidden){previous=0;raf=requestAnimationFrame(frame);}
  }
  const resize=new ResizeObserver(()=>{
    const box=canvas.getBoundingClientRect();
    width=box.width;height=box.height;
    const ratio=Math.min(devicePixelRatio||1,1.7);
    canvas.width=Math.max(1,Math.round(width*ratio));canvas.height=Math.max(1,Math.round(height*ratio));
    ink.setTransform(ratio,0,0,ratio,0,0);draw();
  });
  resize.observe(canvas);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();}).observe(canvas);
  canvas.addEventListener('pointermove',event=>{
    if(reduced.matches || event.pointerType==='touch')return;
    const box=canvas.getBoundingClientRect();
    pointerX=(event.clientX-box.left)/box.width*2-1;pointerY=(event.clientY-box.top)/box.height*2-1;wake();
  });
  canvas.addEventListener('pointerleave',()=>{pointerX=pointerY=0;wake();});
  document.addEventListener('visibilitychange',wake);
  window.addEventListener('scroll',()=>{if(!reduced.matches)wake();},{passive:true});
  reduced.addEventListener('change',()=>{pointerX=pointerY=gazeX=gazeY=0;wake();});
}

