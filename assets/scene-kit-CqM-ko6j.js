import{r as g,a0 as E,p as b,aF as C,q as A,j as c,v as F,t as v,i as G,h as T,F as H}from"./index-CEm_C0iL.js";import{L as k}from"./Line-BsJBXrO2.js";import{f as S,n as $}from"./Surface3D-7dUdfSBN.js";const p=["#1e1b4b","#1d4ed8","#06b6d4","#34d399","#facc15","#f97316","#be123c"],_=e=>{const o=new v(e);return`vec3(${o.r.toFixed(4)}, ${o.g.toFixed(4)}, ${o.b.toFixed(4)})`},O=`
vec3 tp5Palette(float t) {
  t = clamp(t, 0.0, 1.0) * ${p.length-1}.0;
  vec3 c[${p.length}] = vec3[${p.length}](${p.map(_).join(", ")});
  int i = int(min(floor(t), ${p.length-2}.0));
  return mix(c[i], c[i + 1], smoothstep(0.0, 1.0, t - float(i)));
}
/* 1 on a contour line, 0 between them; the line keeps a constant width on screen */
float tp5Contour(float s, float width) {
  float d = abs(fract(s - 0.5) - 0.5) / max(fwidth(s), 1e-5);
  return 1.0 - smoothstep(0.0, width, d);
}
`,w=p.map(e=>new v(e)),R=new v(1,1,1);function V(e,o=.28){const t=Math.min(1,Math.max(0,e))*(p.length-1),n=Math.min(Math.floor(t),p.length-2),a=t-n,i=w[n].clone().lerp(w[n+1],a*a*(3-2*a)).lerp(R,o),r={r:0,g:0,b:0};return i.getRGB(r,G),[r.r*255,r.g*255,r.b*255]}function L(e,o,t){return e.onBeforeCompile=n=>{Object.assign(n.uniforms,o),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
varying float vH;
${t?"attribute float aH;":""}`).replace("#include <begin_vertex>",`#include <begin_vertex>
vH = ${t?"aH":"position.y"};`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying float vH;
uniform float uMin;
uniform float uMax;
uniform float uLines;
uniform float uLevel;
uniform float uInk;
uniform float uInkW;
${O}`).replace("#include <color_fragment>",`#include <color_fragment>
        float t = (vH - uMin) / max(uMax - uMin, 1e-6);
        vec3 col = tp5Palette(t)${t?"":" * 0.92"};
        ${t?"col = mix(col, vec3(1.0), 0.28);":""}
        float s = t * uLines;
        col = mix(col, vec3(0.06, 0.06, 0.16), ${t?"tp5Contour(s, 1.1) * 0.5":"tp5Contour(s, uInkW) * uInk"});
        float level = 1.0 - smoothstep(0.0, 2.6, abs(t - uLevel) / max(fwidth(t), 1e-6));
        col = mix(col, vec3(1.0), level * 0.95);
        diffuseColor.rgb = col;`)},e.customProgramCacheKey=()=>`tp5-contour-${t}`,e}function*W(e,o,t,n,a=(x,m,d)=>[x,d,m],i=40,r=128){const x=[...a(o,t,e(o,t))],m=[];for(let s=1;s<=i;s++){yield;const h=n*s/i;for(let u=0;u<r;u++){const l=2*Math.PI*u/r,f=o+h*Math.cos(l),M=t+h*Math.sin(l);x.push(...a(f,M,e(f,M)))}}for(let s=0;s<r;s++)m.push(0,1+s,1+(s+1)%r);for(let s=1;s<i;s++){s%16===0&&(yield);const h=1+(s-1)*r,u=1+s*r;for(let l=0;l<r;l++){const f=(l+1)%r;m.push(h+l,u+l,h+f,h+f,u+l,u+f)}}yield;const d=new T;return d.setAttribute("position",new H(x,3)),d.setIndex(m),yield*$(d),d}function Y(e,o,t,n,a,i,r){return S(W(e,o,t,n,a,i,r))}function y(e){e.computeBoundingBox();const o=e.boundingBox;return[o.min.y,o.max.y]}function z(e,o=.35){const[,t]=y(e);return-(j(e,o)+t)/2}function j(e,o=.35){const[t,n]=y(e);return t-o*Math.max(n-t,.5)}function*I(e,o=.35){const t=e.clone(),n=t.getAttribute("position"),a=new Float32Array(n.count),i=j(e,o);for(let r=0;r<n.count;r++)r%8192===0&&(yield),a[r]=n.getY(r),n.setY(r,i);return t.setAttribute("aH",new F(a,1)),yield*$(t),t}function*J(e,o=.35){const t=yield*e,n=j(t,o),a=z(t,o),i=yield*I(t,o);return{geo:t,floorGeo:i,floorY:n,lift:a}}function q(){return c.jsx("directionalLight",{position:[-5,4,-6],intensity:.6,color:"#c4b5fd"})}function Q({geo:e,floorGeo:o,lines:t=14,floor:n=!0,gap:a=.35,sweep:i=!0,range:r,ink:x=.38,inkWidth:m=1.1}){const{surfMat:d,floorMat:s,u:h}=g.useMemo(()=>{const[l,f]=r??y(e),M={uMin:{value:l},uMax:{value:f},uLines:{value:t},uLevel:{value:-1},uInk:{value:x},uInkW:{value:m}},P=L(new E({roughness:.55,clearcoat:.35,clearcoatRoughness:.45,sheen:.4,side:b}),M,!1),B=L(new C({transparent:!0,opacity:.9,side:b,depthWrite:!1}),M,!0);return{surfMat:P,floorMat:B,u:M}},[e,t,r?.[0],r?.[1],x,m]),u=g.useMemo(()=>n?o??S(I(e,a)):null,[n,o,e,a]);return A(({clock:l})=>{if(!i)return;const f=.5-.5*Math.cos(l.elapsedTime*2*Math.PI/14);h.uLevel.value=-.04+1.08*f}),c.jsxs(c.Fragment,{children:[c.jsx(q,{}),c.jsx("mesh",{geometry:e,material:d}),u&&c.jsx("mesh",{geometry:u,material:s,renderOrder:-1})]})}const U="#7c3aed";function X({position:e,floorY:o,color:t}){const[n,a,i]=e;return c.jsxs(c.Fragment,{children:[c.jsx(k,{points:[[n,a,i],[n,o,i]],color:t,lineWidth:2.2,dashed:!0,dashSize:.12,gapSize:.08}),c.jsxs("mesh",{position:[n,o+.002,i],rotation:[-Math.PI/2,0,0],children:[c.jsx("ringGeometry",{args:[.1,.17,40]}),c.jsx("meshBasicMaterial",{color:t,side:b})]}),c.jsxs("mesh",{position:[n,o+.001,i],rotation:[-Math.PI/2,0,0],children:[c.jsx("circleGeometry",{args:[.1,40]}),c.jsx("meshBasicMaterial",{color:"#ffffff",side:b})]})]})}new v("#7dd3fc");new v("#fbbf24");new v("#f472b6");export{X as C,Q as E,O as P,q as a,V as b,U as c,W as d,Y as e,J as p};
