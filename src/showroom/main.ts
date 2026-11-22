import './direction.css';
import { mountExposure } from './exposure';
import gsap from 'gsap';
import { mountInstrument } from './instrument';

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width:760px), (max-height:500px)');
const clamp = (n: number) => Math.min(1, Math.max(0,n));
const all = <T extends HTMLElement>(selector: string) => Array.from(document.querySelectorAll<T>(selector));

function restoreCommissionAnchor() {
  if (location.pathname === '/' && /^#section-(scope|cycle|foundation|process|faq|build)$/.test(location.hash)) {
    location.replace('/commission/' + location.search + location.hash);
  }
}
restoreCommissionAnchor();
window.addEventListener('hashchange', restoreCommissionAnchor);

// A travelling front crosses the pinned print. The crest flattens at either end,
// so reversing scroll uncovers exactly the same part of the underlying print.
function liquidEdge(progress: number) {
  if (progress<=0) return 'inset(100% 0 0)';
  if (progress>=1) return 'inset(0)';
  const crest = 17 * Math.sin(Math.PI*progress);
  const points = Array.from({length:25},(_,i)=>{
    const x=i/24;
    const y=100*(1-progress) + crest*(.85*Math.sin(2.3*x+progress*2)-.52*Math.cos(5.1*x-progress*3));
    return (100*x).toFixed(1)+'% '+y.toFixed(2)+'%';
  });
  return 'polygon(0 100%,'+points.join(',')+',100% 100%)';
}

function exhibition() {
  const cards=all<HTMLElement>('.project');
  const sheets=all<HTMLAnchorElement>('.sheet');
  const index=all<HTMLAnchorElement>('.folio a');
  const approach=document.querySelector<HTMLElement>('.approach')!;
  const note=document.querySelector<HTMLElement>('.note')!;
  const detail=document.querySelector<HTMLElement>('.reading section:last-child')!;
  const work=document.querySelector<HTMLElement>('.work')!;
  const exhibition=document.querySelector<HTMLElement>('.exhibition')!;
  const pin=exhibition.querySelector<HTMLElement>('.gallery-stage')!;
  const stops=cards.map(()=>{const stop=document.createElement('span');stop.className='scroll-stop';exhibition.prepend(stop);return stop;});
  let pinned=false;
  let travel=0;
  let pinTop=0;
  function measure(){
    pinned=!compact.matches && !reduce.matches;
    exhibition.classList.toggle('pinned',pinned);
    cards.forEach((card,i)=>{
      const id=card.dataset.project!;
      card.removeAttribute('id');stops[i].removeAttribute('id');
      (pinned?stops[i]:card).id=id;
      card.inert=false;
    });
    travel=Math.max(1,exhibition.offsetHeight-pin.offsetHeight);
    pinTop=parseFloat(getComputedStyle(pin).top)||0;
    stops.forEach((stop,i)=>stop.style.top=(travel*i/(cards.length-1))+'px');
    schedule();
  }
  let active=-1;
  let frame=0;
  function draw(){
    frame=0;
    const height=innerHeight;
    const near=clamp(1-Math.abs(work.getBoundingClientRect().top-height*.55)/(height*.65));
    const animated=!reduce.matches;
    const exit=clamp((height-approach.getBoundingClientRect().top)/height);
    const curve=animated?Math.sin(Math.PI*exit):0;
    approach.style.setProperty('--turn', (curve*Math.min(65,height*.09)).toFixed(2)+'px');
    pin.style.setProperty('--release', animated?String(1-exit*.05):'1');

    work.style.setProperty('--crest',animated?near*near*44+'px':'0px');
    let current=0;
    const coverage=[1,0,0];
    if(pinned){
      const position=clamp((pinTop-exhibition.getBoundingClientRect().top)/travel)*(cards.length-1);
      for(let i=1;i<cards.length;i++){
        const progress=clamp((position-i+.78)/.56);
        coverage[i]=progress;
        sheets[i].style.clipPath=liquidEdge(progress);
        if(progress>=.5)current=i;
      }
    }
    cards.forEach((card,i)=>{
      card.classList.toggle('on-view',i===current);
      card.inert=pinned && i!==current;
    });
    sheets.forEach((sheet,i)=>{
      const hidden=coverage[i]===0 || coverage.slice(i+1).includes(1);
      if(sheet.inert!==hidden){
        sheet.inert=hidden;
        if(hidden)sheet.dispatchEvent(new Event('release-preview'));
      }
      if(current!==active){
        sheet.tabIndex=i===current?0:-1;
        if(i===current)index[i].setAttribute('aria-current','location');
        else index[i].removeAttribute('aria-current');
      }
    });
    active=current;
    const box=note.getBoundingClientRect();
    if(box.top<height && box.bottom>0 && animated){
      const amount=clamp((height-box.top)/(height+box.height));
      note.style.setProperty('--field-x',(amount-.5)*18+'%');
      note.style.setProperty('--field-y',(amount-.5)*9+'%');
      note.style.setProperty('--field-angle',(amount-.5)*16+'deg');
      note.style.setProperty('--cut',100*(1-clamp((height*.78-detail.getBoundingClientRect().top)/(height*.45)))+'%');
    }
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',measure);
  reduce.addEventListener('change',measure);
  new ResizeObserver(measure).observe(pin);
  document.fonts.ready.then(measure);
  measure();
  draw();
}

function previewControls() {
  const excerpts: Record<string, string> = {
    'studio-bespoke': 'studio-bespoke-projection',
    laterite: 'laterite-reserve',
    'xbd-collective': 'xbd-team',
  };
  const dialog = document.querySelector<HTMLDialogElement>('#preview-dialog');
  if(!dialog)return;
  const video=dialog.querySelector('video')!;
  const title=dialog.querySelector<HTMLElement>('#preview-name')!;
  dialog.setAttribute('aria-labelledby',title.id);
  for(const button of all<HTMLButtonElement>('[data-preview]'))button.addEventListener('click',()=>{
    const project=button.closest('.project')!;
    title.textContent=project.querySelector('h3')!.textContent+' · Motion preview';
    video.src='/flagship/media/'+excerpts[button.dataset.preview!]+'.mp4';
    dialog.showModal();
    video.play().catch(()=>{ /* Native controls remain available. */ });
  });
  dialog.querySelector('button')!.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();});
  dialog.addEventListener('click',event=>{if(event.target===dialog && (event.offsetX<0 || event.offsetX>dialog.clientWidth || event.offsetY<0 || event.offsetY>dialog.clientHeight))dialog.close();});
  for(const sheet of all<HTMLAnchorElement>('.sheet')){
    const film=document.createElement('video');
    film.muted=true;film.playsInline=true;film.preload='none';film.setAttribute('aria-hidden','true');sheet.querySelector('.website-print')!.append(film);
    let version=0;
    function stop(){version++;film.pause();sheet.classList.remove('playing');}
    function play(){
      if(reduce.matches || sheet.inert || !matchMedia('(hover:hover)').matches)return;
      const token=++version;
      if(!film.hasAttribute('src'))film.src='/flagship/media/'+excerpts[sheet.pathname.split('/')[2]]+'.mp4';
      film.currentTime=0;
      film.play().then(()=>{if(token===version)sheet.classList.add('playing');}).catch(stop);
    }
    sheet.addEventListener('pointerenter',play);sheet.addEventListener('pointerleave',stop);
    sheet.addEventListener('focus',()=>{if(sheet.matches(':focus-visible'))play();});
    sheet.addEventListener('blur',stop);sheet.addEventListener('release-preview',stop);
    film.addEventListener('ended',stop);reduce.addEventListener('change',stop);
  }
}

function footerLight(){
  const relief=document.querySelector<HTMLElement>('.relief');
  if(!relief)return;
  relief.addEventListener('pointermove',event=>{
    if(reduce.matches || event.pointerType==='touch')return;
    const rect=relief.getBoundingClientRect();
    relief.style.setProperty('--lx',(event.clientX-rect.left)/rect.width*100+'%');
    relief.style.setProperty('--ly',(event.clientY-rect.top)/rect.height*100+'%');
  });
  const observer=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting || reduce.matches || !matchMedia('(hover:none)').matches)return;
    gsap.fromTo(relief,{'--lx':'-14%'},{'--lx':'58%',duration:2.8,ease:'sine.inOut'});observer.disconnect();
  });
  observer.observe(relief);
}

function textReveals(){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    if(!reduce.matches)entry.target.animate([{transform:'translateY(13px)',opacity:.58},{transform:'none',opacity:1}],
      {duration:640,easing:'cubic-bezier(.17,.72,.21,1)'});
    observer.unobserve(entry.target);
  }),{threshold:.15});
  all('main h2,main h3,.case-intro p,.work-head p,.reading p,.project p,.instrument-heading p').forEach(el=>observer.observe(el));
}

// Only visible spreads and boundaries need a scroll pass.
function sectionLight(){
  const visible=new Set<HTMLElement>();
  let frame=0;
  function render(){
    frame=0;
    visible.forEach(el=>{
      const rect=el.getBoundingClientRect();
      const progress=clamp((innerHeight-rect.top)/(innerHeight+rect.height));
      const signed=reduce.matches?0:progress-.5;
      el.style.setProperty('--pass',(signed*32).toFixed(2)+'%');
      el.style.setProperty('--drift',(signed*42).toFixed(2)+'px');
    });
  }
  function tick(){if(!frame)frame=requestAnimationFrame(render);}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const el=entry.target as HTMLElement;
      if(entry.isIntersecting)visible.add(el);else visible.delete(el);
    });
    tick();
  });
  all('.approach,.spreads figure,.instrument,.case-opening').forEach(el=>observer.observe(el));
  window.addEventListener('scroll',tick,{passive:true});
  reduce.addEventListener('change',tick);
}
sectionLight();

const stage=document.querySelector<HTMLElement>('.exposure');
if(stage){
  exhibition();
  previewControls();
  mountExposure(stage, reduce);
}
const header=document.querySelector<HTMLElement>('.site-head');
if(header){
  const update=()=>header.classList.toggle('compact',scrollY>32);
  update();window.addEventListener('scroll',update,{passive:true});
}
const instrument=document.querySelector<HTMLElement>('.instrument');
if(instrument)mountInstrument(instrument);
for(const details of all<HTMLDetailsElement>('details[data-film]')){
  const video=details.querySelector('video')!;
  details.addEventListener('toggle',()=>{
    if(!details.open){video.pause();return;}
    if(!video.hasAttribute('src'))video.src='/more-than-a-gallery/projects/'+details.dataset.film+(innerWidth<=760?'-mobile.mp4':'-desktop.mp4');
  });
}
footerLight();textReveals();


