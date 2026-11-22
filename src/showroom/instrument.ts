import './instrument.css';

const rooms = {
  restraint: {name:'Shadow wall', alt:'Low sofa beside a wall cut by diagonal sunlight', focus:'72% 54%', wide:'The wide frame lets you follow the diagonal light from the floor to the wall.', detail:'The close crop draws your eye to the edge where light meets plaster.', dusk:'At dusk, the band of light on the plaster stands out against the darker room.'},
  scale: {name:'Garden room', alt:'A low seating island faces a tall opening onto a garden', focus:'50% 37%', wide:'The wide frame lets you measure the garden opening against the low seating.', detail:'The closer crop gives the framed garden more weight than the seating.', dusk:'As the interior darkens, the bright garden opening becomes the focal point.'},
  sequence: {name:'Enfilade', alt:'A sequence of dark doorframes receding into the distance', focus:'49% 48%', wide:'The wide view lets you count the doorframes and read the depth between them.', detail:'Cropping the outer walls draws your eye down the line of openings.', dusk:'Darkening the foreground draws your eye toward the light in the last doorway.'},
};
type RoomId = keyof typeof rooms;

export function mountInstrument(section: HTMLElement) {
  const view = section.querySelector<HTMLElement>('.composition')!;
  const camera = section.querySelector<HTMLElement>('.camera')!;
  const framing = section.querySelector<HTMLInputElement>('#framing')!;
  const light = section.querySelector<HTMLInputElement>('#atmosphere')!;
  const caption = section.querySelector<HTMLElement>('.observation')!;
  const name = section.querySelector<HTMLElement>('.plate-type strong')!;
  const pictures = new Map<RoomId, HTMLImageElement>([['restraint', camera.querySelector('img')!]]);
  let room: RoomId = 'restraint';
  let revision = 0;

  function explain(change: string) {
    const study = rooms[room];
    let line = Number(framing.value) >= 42 ? study.detail : study.wide;
    if (change === 'layout') line = view.dataset.layout === 'spread'
      ? 'Moving the title into the margin lets the eye explore the photograph without crossing type.'
      : 'Placing the title inside the photograph makes the words and the room read as one opening.';
    else if (change === 'light' || (change === 'room' && Number(light.value) > 60)) {
      line = Number(light.value) >= 38 ? study.dusk : 'Daylight opens the shadows so adjacent surfaces are easier to distinguish.';
    }
    if (caption.textContent !== line) caption.textContent = line;
  }
  framing.addEventListener('input', () => {
    view.style.setProperty('--zoom', String(1 + Number(framing.value) * .011));
    explain('framing');
  });
  light.addEventListener('input', () => {
    const dusk = Number(light.value) / 100;
    view.style.setProperty('--exposure', String(1 - .39 * dusk));
    view.style.setProperty('--tint', String(.83 * dusk));
    view.style.setProperty('--saturation', String(1 - .27 * dusk));
    explain('light');
  });
  const layouts = section.querySelectorAll<HTMLButtonElement>('button[data-layout]');
  for (const button of layouts) button.addEventListener('click', () => {
    view.dataset.layout = button.dataset.layout;
    layouts.forEach(el => el.setAttribute('aria-pressed',String(el===button)));
    explain('layout');
  });
  const choices = section.querySelectorAll<HTMLButtonElement>('[data-room]');
  for (const button of choices) button.addEventListener('click', async () => {
    const id = button.dataset.room as RoomId;
    const version = ++revision;
    let image = pictures.get(id);
    if (!image) {
      image = new Image();
      image.alt = rooms[id].alt;
      image.style.opacity = '0';
      image.src = '/more-than-a-gallery/principles/' + id + '-1600.webp';
      camera.append(image);
      pictures.set(id,image);
    }
    try { await image.decode(); } catch { if(version===revision) caption.textContent='This study could not be loaded. Select a room to try again.'; pictures.delete(id); image.remove(); return; }
    if (version !== revision) return;
    room = id;
    pictures.forEach((img,key) => {
      img.style.opacity = key===id ? '1' : '0';
      img.setAttribute('aria-hidden',String(key!==id));
    });
    choices.forEach(el => el.setAttribute('aria-pressed',String(el===button)));
    view.style.setProperty('--focus',rooms[id].focus);
    name.textContent = rooms[id].name;
    explain('room');
  });
}
