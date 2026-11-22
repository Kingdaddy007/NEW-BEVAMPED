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

uniform vec2 pointer;
uniform float angle, phase, exitAmount, intro, portrait;
float bell(float d,float width){return exp(-d*d/(width*width));}
float noise(vec2 p){
  vec3 h=fract(vec3(p.xyx)*.1031);
  h+=dot(h,h.yzx+33.33);
  return fract((h.x+h.y)*h.z);
}
void main() {
  // A moving edge splits the same exposure over a near and a distant leaf.
  // Different magnification on each side makes forward travel visible on scroll.
  float settle=smoothstep(.12,.88,intro);
  float nearEdge=.72-.21*uv.y + .045*sin(4.*uv.y+phase*.28)
     +.34*exitAmount+.13*(1.-settle)+pointer.x*.015;
  float nearLeaf=smoothstep(nearEdge-.003,nearEdge+.003,uv.x);
  float lens=mix(1.0,.76,nearLeaf)-exitAmount*mix(.13,.31,nearLeaf);
  vec2 p=(uv-vec2(.68,.54))*lens+vec2(.68,.54);
  p.x+=nearLeaf*(.038+.014*sin(phase*.78)) +pointer.x*.017;
  p.y+=nearLeaf*(.17+.026*sin(phase*.51)) - exitAmount*.12 +pointer.y*.014;
  p.y+=.038*sin(phase+uv.x*2.4);
  float x=p.x;
  float y=p.y;
  float bow=.62+.125*sin(4.25*x+.25)-.98*x*x+.28*x+.024*sin(7.3*x+phase);
  float spread=.09+.25*x+.078*sin(3.8*x);
  float closing=smoothstep(.05,.90,exitAmount);
  bow=mix(bow,.90,closing*.42);
  spread=mix(spread,.13,closing*.6);
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

  float edgeDist=uv.x-nearEdge;
  col*=1.-.13*exp(-abs(edgeDist)*38.)*(1.-nearLeaf);
  col=mix(col,vec3(.98,.95,.87),.36*exp(-abs(edgeDist)*240.));
  col=mix(col,paper,nearLeaf*.13);
  // In the ident, the colours occupy the thin join between two sheets.
  float slit=.01+1.3*smoothstep(.14,.79,intro);
  float bearing=uv.y-.53+.22*(uv.x-.5);
  float reveal=1.-smoothstep(slit,slit+.043,abs(bearing));
  col=mix(paper*(.976+.024*step(0.,bearing))+grain*.025,col,reveal);
  gl_FragColor=vec4(col,1.);
}`;
