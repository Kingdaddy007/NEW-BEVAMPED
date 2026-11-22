import { fragmentSource, vertexSource } from './exposure-shader';

function opticalFilm(canvas:HTMLCanvasElement, title:HTMLElement) {
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
  const ink=document.createElement('canvas');
  const ctx=ink.getContext('2d',{alpha:false});
  if(!ctx) return;
  gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const uniforms=Object.fromEntries(['pointer','angle','phase','exitAmount','intro','portrait'].map(name=>[name,gl.getUniformLocation(program,name)]));
  function typeset(){
    const box=canvas.getBoundingClientRect();
    const ratio=Math.min(devicePixelRatio,1.5,1800/Math.max(1,box.width),1600/Math.max(1,box.height));
    canvas.width=ink.width=Math.max(1,Math.round(box.width*ratio));
    canvas.height=ink.height=Math.max(1,Math.round(box.height*ratio));
    ctx!.setTransform(ink.width/box.width,0,0,ink.height/box.height,0,0);
    ctx!.globalCompositeOperation='source-over';
    ctx!.fillStyle='#000';ctx!.fillRect(0,0,box.width,box.height);
    ctx!.globalCompositeOperation='lighter';
    ctx!.fillStyle='#f00';
    // Measure the live baselines, including the italic connector. This keeps
    // the refracted ink registered with the accessible HTML at any font size.
    title.querySelectorAll<HTMLElement>('.lead-word,.link-word,.last-word').forEach(word=>{
      const style=getComputedStyle(word);
      ctx!.font=style.fontStyle+' '+style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
      const width=word.getBoundingClientRect().width;
      ctx!.save();
      ctx!.translate(word.getBoundingClientRect().left-box.left,word.querySelector('i')!.getBoundingClientRect().top-box.top);
      ctx!.letterSpacing=style.letterSpacing;
      ctx!.scale(width/Math.max(1,ctx!.measureText(word.textContent!).width),1);
      ctx!.fillText(word.textContent!,0,0);ctx!.restore();
    });
    ctx!.fillStyle='#0f0';
    ctx!.font='500 '+Math.min(box.width*.126,140)+'px "Barlow Semi Condensed", Arial, sans-serif';
    ctx!.letterSpacing='-2px';
    const left=title.getBoundingClientRect().left-box.left;
    ctx!.fillText('BEVAMPED',left,box.height*.52);
    gl!.texImage2D(gl!.TEXTURE_2D,0,gl!.RGB,gl!.RGB,gl!.UNSIGNED_BYTE,ink);
    gl!.viewport(0,0,canvas.width,canvas.height);
  }
  return { typeset, draw(x:number,y:number,angle:number,phase:number,exit:number,intro:number){
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
  const title=hero.querySelector<HTMLElement>('h1')!;
  const dial=hero.querySelector<HTMLLabelElement>('.light-dial')!;
  const range=dial.querySelector('input')!;
  let film:ReturnType<typeof opticalFilm>;
  let visible=true,dirty=true,frame=0,previousPaint=-100;
  let x=0,y=0,tx=0,ty=0,angle=0;
  let started: number | undefined;
  let opening=document.documentElement.classList.contains('play-ident') && scrollY<5;
  function paint(now:number) {
    frame=0;
    if(!visible || document.hidden || reduced.matches || !film) return;
    if(!dirty && now-previousPaint<30){schedule();return;}
    previousPaint=now;
    if(dirty){film.typeset();dirty=false;}
    started ??= now;
    const elapsed=Math.max(0,now-started);
    const intro=opening?Math.min(1,elapsed/2350):1;
    const phase=opening?Math.min(1,elapsed/4200):1;
    x+=(tx-x)*.13;y+=(ty-y)*.13;
    const scroll=Math.max(0,Math.min(1,-hero.getBoundingClientRect().top/hero.offsetHeight));
    film.draw(x,y,angle,.7*Math.sin(phase*Math.PI/2)+angle*.55,scroll,intro);
    hero.classList.add('live');
    if(phase<1 || Math.abs(x-tx)+Math.abs(y-ty)>.003) schedule();
  }
  function schedule(){if(!frame && visible && !document.hidden && !reduced.matches && film) frame=requestAnimationFrame(paint);}
  function configure(){
    if(!reduced.matches && !film) film=opticalFilm(canvas,title);
    dial.hidden=!film || reduced.matches;
    if(dial.hidden) hero.classList.remove('live');
    dirty=true;schedule();
  }
  hero.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse')return;
    const r=hero.getBoundingClientRect();tx=2*(e.clientX-r.left)/r.width-1;ty=2*(e.clientY-r.top)/r.height-1;schedule();
  });
  hero.addEventListener('pointerleave',()=>{tx=ty=0;schedule();});
  range.addEventListener('input',()=>{angle=Number(range.value)/100;schedule();});
  window.addEventListener('scroll',()=>{if(scrollY>12) opening=false;schedule();},{passive:true});
  new ResizeObserver(()=>{dirty=true;schedule();}).observe(hero);
  document.fonts.ready.then(()=>{dirty=true;schedule();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();}).observe(hero);
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',configure);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();film=undefined;hero.classList.remove('live');dial.hidden=true;});
  canvas.addEventListener('webglcontextrestored',configure);
  configure();
}
