import { cutMark } from './mark-geometry';

const vertex = `
attribute vec3 position, normal;
uniform float layer, aspect, yaw, pitch, opening, travel;
varying vec3 n, world;
varying float plate;
mat2 turn(float a) {float c=cos(a), s=sin(a); return mat2(c,s,-s,c);}
void main(){
  vec3 p=position;
  n=normal; plate=layer;
  float twist=layer*(.26+.48*travel)+.10;
  p.xy=turn(twist)*p.xy; n.xy=turn(twist)*n.xy;
  p.z+=layer*(1.95+.90*travel+.80*opening);
  p.xz=turn(yaw)*p.xz; n.xz=turn(yaw)*n.xz;
  p.yz=turn(pitch)*p.yz; n.yz=turn(pitch)*n.yz;
  p.xy=turn(-.115)*p.xy; n.xy=turn(-.115)*n.xy;
  world=p;
  float camera=4.85-p.z;
  gl_Position=vec4(2.49*p.x/aspect,2.49*p.y,camera-1.7,camera);
}`;
const fragment = `
precision mediump float;
varying vec3 n,world;
varying float plate;
uniform float lightShift;
void main(){
  vec3 N=normalize(n), V=normalize(vec3(0.,0.,4.85)-world);
  vec3 R=reflect(-V,N);
  float sweep=R.x*.76+R.y*.61+world.x*.21+world.y*.10+lightShift;
  float softbox=exp(-4.1*abs(sweep-.35));
  float rim=pow(1.-abs(dot(N,V)),2.);
  float key=max(dot(N,normalize(vec3(-.4,.8,1.))),0.);
  float seam=.58+.42*smoothstep(-.46,.48,plate);
  vec3 alloy=mix(vec3(.28,.114,.09),vec3(.83,.47,.33),key*.77+.16);
  vec3 color=alloy*(.35+.83*softbox)*seam;
  color+=vec3(.98,.86,.68)*(.49*exp(-20.*abs(sweep-.40))+.20*rim);
  color+=vec3(.26,.23,.34)*exp(-5.*abs(R.y+.55));
  gl_FragColor=vec4(color,1.);
}`;

function createRenderer(canvas: HTMLCanvasElement) {
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'low-power'});
  if(!gl) return;
  const program=gl.createProgram();
  if(!program) return;
  for (const [type,code] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]] as const) {
    const shader=gl.createShader(type);
    if(!shader) return;
    gl.shaderSource(shader,code); gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) return;
    gl.attachShader(program,shader); gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const mesh=cutMark();
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);
  for (const [i,name] of ['position','normal'].entries()) {
    const slot=gl.getAttribLocation(program,name);
    gl.enableVertexAttribArray(slot); gl.vertexAttribPointer(slot,3,gl.FLOAT,false,24,i*12);
  }
  const uniforms = Object.fromEntries(['layer','aspect','yaw','pitch','opening','travel','lightShift'].map(key=>[key,gl.getUniformLocation(program,key)]));
  gl.clearColor(0,0,0,0); gl.enable(gl.DEPTH_TEST);
  return (x:number,y:number,entry:number,travel:number) => {
    const ratio=Math.min(devicePixelRatio,1.6);
    const width=Math.max(1,Math.round(canvas.clientWidth*ratio)),height=Math.max(1,Math.round(canvas.clientHeight*ratio));
    if(canvas.width!==width || canvas.height!==height) {canvas.width=width;canvas.height=height;}
    gl.viewport(0,0,width,height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(uniforms.aspect,width/height);
    gl.uniform1f(uniforms.yaw,-.67+x*.22-entry*.88-travel*.36);
    gl.uniform1f(uniforms.pitch,.24-y*.16+entry*.24);
    gl.uniform1f(uniforms.opening,entry);gl.uniform1f(uniforms.travel,travel);
    gl.uniform1f(uniforms.lightShift,x*.18+entry*.65+travel*.28);
    for(let i=0;i<32;i++) {
      gl.uniform1f(uniforms.layer,i/31-.5);
      gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_SHORT,0);
    }
  };
}

export function mountStudioMark(hero:HTMLElement,reduced:MediaQueryList) {
  const chapters=new IntersectionObserver(entries=>{
    for(const entry of entries) if(entry.isIntersecting){entry.target.classList.add('in-frame');chapters.unobserve(entry.target);}
  },{threshold:.12});
  document.querySelectorAll('.approach-steps article,.instrument .composition,.commission,.colophon').forEach(el=>chapters.observe(el));

  const canvas=hero.querySelector('canvas')!;
  let draw: ReturnType<typeof createRenderer>;
  let frame=0, visible=true, x=0, y=0, tx=0, ty=0;
  const start=performance.now();
  const intro=document.documentElement.classList.contains('play-ident') && scrollY<8;
  function paint(now:number) {
    frame=0;
    if(!visible || document.hidden || reduced.matches || !draw) return;
    const age=now-start;
    const entry=intro && scrollY<8 ? Math.pow(Math.max(0,1-age/1550),2.5) : 0;
    x+=(tx-x)*.15;y+=(ty-y)*.15;
    const rect=hero.getBoundingClientRect();
    const travel=Math.max(0,Math.min(1,-rect.top/rect.height));
    draw(x,y,entry,travel);
    hero.classList.add('mark-live');
    hero.style.setProperty('--light-at',(72+x*5+travel*6)+'%');
    if(entry>0 || Math.abs(tx-x)+Math.abs(ty-y)>.003) schedule();
  }
  function schedule() {if(draw && visible && !document.hidden && !reduced.matches && !frame) frame=requestAnimationFrame(paint);}
  function configure() {
    if(!draw && !reduced.matches) draw=createRenderer(canvas);
    if(reduced.matches) hero.classList.remove('mark-live');
    schedule();
  }
  hero.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse') return;
    const rect=hero.getBoundingClientRect();
    tx=2*(e.clientX-rect.left)/rect.width-1;ty=2*(e.clientY-rect.top)/rect.height-1;schedule();
  });
  hero.addEventListener('pointerleave',()=>{tx=ty=0;schedule();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();}).observe(hero);
  new ResizeObserver(schedule).observe(canvas);
  document.addEventListener('visibilitychange',schedule);
  window.addEventListener('scroll',schedule,{passive:true});
  reduced.addEventListener('change',configure);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();draw=undefined;hero.classList.remove('mark-live');});
  canvas.addEventListener('webglcontextrestored',configure);
  configure();
}
