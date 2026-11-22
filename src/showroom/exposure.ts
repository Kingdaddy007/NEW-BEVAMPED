import { fragmentSource, vertexSource } from './exposure-shader';

function opticalFilm(canvas:HTMLCanvasElement) {
  const gl=canvas.getContext('webgl',{antialias:false,alpha:false,depth:false,powerPreference:'low-power'});
  if(!gl) return;
  const program=gl.createProgram();
  if(!program) return;
  for(const [kind,source] of [[gl.VERTEX_SHADER,vertexSource],[gl.FRAGMENT_SHADER,fragmentSource]] as const) {
    const shader=gl.createShader(kind);
    if(!shader) return;
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    gl.attachShader(program,shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) return;
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'point');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const uniforms=Object.fromEntries(['pointer','angle','phase','exitAmount','intro','portrait'].map(name=>[name,gl.getUniformLocation(program,name)]));
  function resize(){
    const box=canvas.getBoundingClientRect();
    const ratio=Math.min(devicePixelRatio,1.15,1480/Math.max(1,box.width),1180/Math.max(1,box.height));
    canvas.width=Math.max(1,Math.round(box.width*ratio));
    canvas.height=Math.max(1,Math.round(box.height*ratio));
    gl!.viewport(0,0,canvas.width,canvas.height);
  }
  return { resize, draw(x:number,y:number,angle:number,phase:number,exit:number,intro:number){
    gl.uniform2f(uniforms.pointer,x,y);gl.uniform1f(uniforms.angle,angle);
    gl.uniform1f(uniforms.phase,phase);gl.uniform1f(uniforms.exitAmount,exit);
    gl.uniform1f(uniforms.intro,intro);gl.uniform1f(uniforms.portrait,canvas.width<canvas.height?1:0);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }};
}

export function mountExposure(hero:HTMLElement,reduced:MediaQueryList) {
  const chapters=new IntersectionObserver(entries=>{
    for(const entry of entries) if(entry.isIntersecting){entry.target.classList.add('in-frame');chapters.unobserve(entry.target);}
  },{threshold:.12});
  document.querySelectorAll('.approach-steps article,.instrument .composition,.commission,.colophon').forEach(el=>chapters.observe(el));

  const canvas=hero.querySelector('canvas')!;
  const toggle=hero.querySelector<HTMLButtonElement>('.light-playback')!;
  let paused=false;
  let clock=0;
  let film:ReturnType<typeof opticalFilm>;
  let visible=true,dirty=true,frame=0,previousPaint=-100;
  let x=0,y=0,tx=0,ty=0;
  let started: number | undefined;
  let opening=document.documentElement.classList.contains('play-ident') && scrollY<5;
  function paint(now:number) {
    frame=0;
    if(!visible || document.hidden || reduced.matches || !film) return;
    if(!dirty && now-previousPaint<30){schedule();return;}
    if(!paused) clock+=Math.min(100,Math.max(0,now-previousPaint))*.001;
    previousPaint=now;
    if(dirty){film.resize();dirty=false;}
    started ??= now;
    const elapsed=Math.max(0,now-started);
    const intro=opening?Math.min(1,elapsed/2400):1;
    const phase=clock*.27;
    x+=(tx-x)*.13;y+=(ty-y)*.13;
    const scroll=Math.max(0,Math.min(1,-hero.getBoundingClientRect().top/hero.offsetHeight));
    film.draw(x,y,.18*Math.sin(phase*.74),phase,scroll,intro);
    hero.style.setProperty('--departure',String(scroll));
    hero.classList.add('live');
    if(!paused || intro<1) schedule();
  }
  function schedule(){if(!frame && visible && !document.hidden && !reduced.matches && film) frame=requestAnimationFrame(paint);}
  function configure(){
    if(!reduced.matches && !film) film=opticalFilm(canvas);
    toggle.hidden=!film || reduced.matches;
    if(toggle.hidden) hero.classList.remove('live');
    dirty=true;schedule();
  }
  hero.addEventListener('pointermove',e=>{
    if(paused || e.pointerType!=='mouse')return;
    const r=hero.getBoundingClientRect();tx=2*(e.clientX-r.left)/r.width-1;ty=2*(e.clientY-r.top)/r.height-1;schedule();
  });
  hero.addEventListener('pointerleave',()=>{tx=ty=0;schedule();});
  toggle.addEventListener('click',()=>{
    paused=!paused;
    if(paused){tx=x;ty=y;}
    toggle.setAttribute('aria-label',paused?'Resume ambient light':'Pause ambient light');
    toggle.firstElementChild!.textContent=paused?'▷':'Ⅱ';
    schedule();
  });
  window.addEventListener('scroll',()=>{if(scrollY>12){opening=false;hero.classList.add('entered');}schedule();},{passive:true});
  new ResizeObserver(()=>{dirty=true;schedule();}).observe(hero);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();}).observe(hero);
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',configure);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();film=undefined;hero.classList.remove('live');toggle.hidden=true;});
  canvas.addEventListener('webglcontextrestored',configure);
  if(!opening) hero.classList.add('entered');
  configure();
}
