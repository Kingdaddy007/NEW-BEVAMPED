// A family of bowed glass flutes spreads a warm source into two coloured
// caustics. The same displacement field refracts the typeset ink texture.
export const vertexSource = `
attribute vec2 point;
varying vec2 uv;
void main() {
  uv=vec2(point.x*.5+.5,.5-point.y*.5);
  gl_Position=vec4(point,0.,1.);
}`;

export const fragmentSource = `
precision highp float;
varying vec2 uv;
uniform sampler2D ink;
uniform vec2 pointer;
uniform float angle, phase, exitAmount, intro, portrait, paperOnly;
float bell(float d,float width){return exp(-d*d/(width*width));}
float noise(vec2 p){
  vec3 h=fract(vec3(p.xyx)*.1031);
  h+=dot(h,h.yzx+33.33);
  return fract((h.x+h.y)*h.z);
}
void main() {
  vec2 p=uv;
  p.y+=exitAmount*.135;
  p.x+=pointer.x*.026+angle*.066;
  p.y+=pointer.y*.019+angle*(p.x-.3)*.09;
  float x=p.x;
  float y=p.y;
  float bow=.62+.125*sin(4.25*x+.25)-.98*x*x+.28*x+.024*sin(7.3*x+phase);
  float spread=.09+.25*x+.078*sin(3.8*x);
  float closing=smoothstep(.05,.90,exitAmount);
  bow=mix(bow,1.05,closing*.9);
  spread=mix(spread,.048,closing);
  float d=(y-bow)/spread;
  float edge=smoothstep(.10,.78,x+.16*y);
  float field=edge*exp(-.55*d*d);
  float ripple=(d*6.8+1.2*sin(x*7.7+d*.83+phase*.4)+x*3.0);
  float flute=.5+.5*cos(ripple);
  float fine=.5+.5*cos(ripple*8.0+.6*sin(d*7.));
  float hair=pow(fine,8.);
  vec3 paper=mix(vec3(.967,.948,.905),vec3(.87,.87,.895),smoothstep(.2,1.3,x+.24*y)*.68);
  vec3 violet=vec3(.37,.32,.62);
  vec3 blue=vec3(.15,.24,.55);
  vec3 coral=vec3(.90,.48,.40);
  vec3 gold=vec3(.97,.74,.56);
  vec3 col=mix(paper,blue,edge*bell(d+.42,1.19)*(.38+.51*flute));
  col=mix(col,violet,edge*bell(d-.14,.70)*(.3+.52*(1.-flute)));
  col=mix(col,coral,edge*bell(d-.86,.58)*(.43+.42*flute));
  col=mix(col,gold,edge*bell(d-1.21,.52)*.78);
  // The narrow highlights and their displaced chromatic edges share one curve.
  col=mix(col,vec3(.91,.90,1.),field*(.17*hair+.39*pow(flute,13.)));
  col-=field*(1.-flute)*.08*vec3(.82,.72,.4);
  float rim=edge*bell(d+.94,.095);
  col=mix(col,vec3(.60,.72,.99),rim*.63);
  col+=.11*edge*bell(d+.85,.042);
  // Rays on neighbouring flutes change direction at different rates.
  // Where they meet, the fine lines gather into a much brighter fold.
  float rays=0., spill=0.;
  for(int i=0;i<22;i++){
    float s=float(i)/21.*2.-1.;
    float trajectory=s*.99+.60*sin(5.3*x+3.95*s+phase*.34)
      +.21*sin(10.1*x-3.*s+angle*.48)+.19*s*s;
    float distanceToRay=d-trajectory;
    float w=.012+.016*abs(s)+.018*(1.-edge);
    rays+=bell(distanceToRay,w);
    spill+=bell(distanceToRay,w*4.2);
  }
  float raysVisible=smoothstep(.18,.79,x+.18*y)*(1.-closing*.65);
  col*=1.-.15*raysVisible*bell(d+.10,.99);
  col=mix(col,vec3(.79,.87,1.),raysVisible*.17*(1.-exp(-spill*.53)));
  col=mix(col,vec3(1.,.96,.85),raysVisible*.86*(1.-exp(-rays*1.08)));
  col=mix(col,paper,.37*(1.-smoothstep(0.,.14,uv.y)));
  col=mix(col,paper, .64*(1.-smoothstep(.26,.76,x)) + .14*portrait*(1.-edge));
  float grain=noise(gl_FragCoord.xy)-.5;
  col+=grain*.032;

  float sweep=1.-smoothstep(.04,.30,abs(uv.x-(intro*1.62-.30)));
  float opening=smoothstep(.34,.83,intro-.18*uv.x);
  float glass=(flute-.5)*field;
  vec2 bend=vec2(glass*.007+.027*sweep*(1.-intro),glass*.008);
  bend+=vec2(.005*sin(uv.y*8.),.002)*(1.-opening);
  vec4 masks=texture2D(ink,clamp(uv+bend,0.,1.));
  float focus=opening*masks.r;
  float leader=masks.g*(1.-smoothstep(.23,.52,intro));
  float density=max(focus,leader)*(1.-paperOnly);
  vec3 pigment=mix(vec3(.137,.122,.18),vec3(.21,.16,.31),field*.62);
  col=mix(col,pigment,density);
  gl_FragColor=vec4(col,1.);
}`;
