import{au as re,av as ae,F,aw as W,ax as B,ay as ce,a7 as N,az as Y,V as x,S as le,U as q,aA as k,aB as Z,M as de,aC as z,aD as fe,a3 as ue,aE as pe,r as _,n as he,t as me,j as R}from"./index-CEm_C0iL.js";const ee=parseInt(re.replace(/\D+/g,"")),te=ee>=125?"uv1":"uv2",$=new N,D=new x;class G extends ae{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],s=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(s),this.setAttribute("position",new F(e,3)),this.setAttribute("uv",new F(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,s=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),s.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const s=new W(t,6,1);return this.setAttribute("instanceStart",new B(s,3,0)),this.setAttribute("instanceEnd",new B(s,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let s;e instanceof Float32Array?s=e:Array.isArray(e)&&(s=new Float32Array(e));const n=new W(s,t*2,1);return this.setAttribute("instanceColorStart",new B(n,t,0)),this.setAttribute("instanceColorEnd",new B(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new ce(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new N);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),$.setFromBufferAttribute(t),this.boundingBox.union($))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Y),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const s=this.boundingSphere.center;this.boundingBox.getCenter(s);let n=0;for(let i=0,a=e.count;i<a;i++)D.fromBufferAttribute(e,i),n=Math.max(n,s.distanceToSquared(D)),D.fromBufferAttribute(t,i),n=Math.max(n,s.distanceToSquared(D));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class ne extends G{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,s=new Float32Array(2*t);for(let n=0;n<t;n+=3)s[2*n]=e[n],s[2*n+1]=e[n+1],s[2*n+2]=e[n+2],s[2*n+3]=e[n+3],s[2*n+4]=e[n+4],s[2*n+5]=e[n+5];return super.setPositions(s),this}setColors(e,t=3){const s=e.length-t,n=new Float32Array(2*s);if(t===3)for(let i=0;i<s;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];else for(let i=0;i<s;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5],n[2*i+6]=e[i+6],n[2*i+7]=e[i+7];return super.setColors(n,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class V extends le{constructor(e){super({type:"LineMaterial",uniforms:q.clone(q.merge([k.common,k.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Z(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${ee>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const I=new z,J=new x,X=new x,l=new z,d=new z,y=new z,j=new x,H=new ue,f=new fe,K=new x,P=new N,T=new Y,S=new z;let w,L;function Q(c,e,t){return S.set(0,0,-e,1).applyMatrix4(c.projectionMatrix),S.multiplyScalar(1/S.w),S.x=L/t.width,S.y=L/t.height,S.applyMatrix4(c.projectionMatrixInverse),S.multiplyScalar(1/S.w),Math.abs(Math.max(S.x,S.y))}function ve(c,e){const t=c.matrixWorld,s=c.geometry,n=s.attributes.instanceStart,i=s.attributes.instanceEnd,a=Math.min(s.instanceCount,n.count);for(let r=0,h=a;r<h;r++){f.start.fromBufferAttribute(n,r),f.end.fromBufferAttribute(i,r),f.applyMatrix4(t);const v=new x,m=new x;w.distanceSqToSegment(f.start,f.end,m,v),m.distanceTo(v)<L*.5&&e.push({point:m,pointOnLine:v,distance:w.origin.distanceTo(m),object:c,face:null,faceIndex:r,uv:null,[te]:null})}}function ge(c,e,t){const s=e.projectionMatrix,i=c.material.resolution,a=c.matrixWorld,r=c.geometry,h=r.attributes.instanceStart,v=r.attributes.instanceEnd,m=Math.min(r.instanceCount,h.count),u=-e.near;w.at(1,y),y.w=1,y.applyMatrix4(e.matrixWorldInverse),y.applyMatrix4(s),y.multiplyScalar(1/y.w),y.x*=i.x/2,y.y*=i.y/2,y.z=0,j.copy(y),H.multiplyMatrices(e.matrixWorldInverse,a);for(let p=0,M=m;p<M;p++){if(l.fromBufferAttribute(h,p),d.fromBufferAttribute(v,p),l.w=1,d.w=1,l.applyMatrix4(H),d.applyMatrix4(H),l.z>u&&d.z>u)continue;if(l.z>u){const g=l.z-d.z,o=(l.z-u)/g;l.lerp(d,o)}else if(d.z>u){const g=d.z-l.z,o=(d.z-u)/g;d.lerp(l,o)}l.applyMatrix4(s),d.applyMatrix4(s),l.multiplyScalar(1/l.w),d.multiplyScalar(1/d.w),l.x*=i.x/2,l.y*=i.y/2,d.x*=i.x/2,d.y*=i.y/2,f.start.copy(l),f.start.z=0,f.end.copy(d),f.end.z=0;const E=f.closestPointToPointParameter(j,!0);f.at(E,K);const A=pe.lerp(l.z,d.z,E),O=A>=-1&&A<=1,U=j.distanceTo(K)<L*.5;if(O&&U){f.start.fromBufferAttribute(h,p),f.end.fromBufferAttribute(v,p),f.start.applyMatrix4(a),f.end.applyMatrix4(a);const g=new x,o=new x;w.distanceSqToSegment(f.start,f.end,o,g),t.push({point:o,pointOnLine:g,distance:w.origin.distanceTo(o),object:c,face:null,faceIndex:p,uv:null,[te]:null})}}}class ie extends de{constructor(e=new G,t=new V({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,s=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let a=0,r=0,h=t.count;a<h;a++,r+=2)J.fromBufferAttribute(t,a),X.fromBufferAttribute(s,a),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+J.distanceTo(X);const i=new W(n,2,1);return e.setAttribute("instanceDistanceStart",new B(i,1,0)),e.setAttribute("instanceDistanceEnd",new B(i,1,1)),this}raycast(e,t){const s=this.material.worldUnits,n=e.camera;n===null&&!s&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const i=e.params.Line2!==void 0&&e.params.Line2.threshold||0;w=e.ray;const a=this.matrixWorld,r=this.geometry,h=this.material;L=h.linewidth+i,r.boundingSphere===null&&r.computeBoundingSphere(),T.copy(r.boundingSphere).applyMatrix4(a);let v;if(s)v=L*.5;else{const u=Math.max(n.near,T.distanceToPoint(w.origin));v=Q(n,u,h.resolution)}if(T.radius+=v,w.intersectsSphere(T)===!1)return;r.boundingBox===null&&r.computeBoundingBox(),P.copy(r.boundingBox).applyMatrix4(a);let m;if(s)m=L*.5;else{const u=Math.max(n.near,P.distanceToPoint(w.origin));m=Q(n,u,h.resolution)}P.expandByScalar(m),w.intersectsBox(P)!==!1&&(s?ve(this,t):ge(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(I),this.material.uniforms.resolution.value.set(I.z,I.w))}}class ye extends ie{constructor(e=new ne,t=new V({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const we=_.forwardRef(function({points:e,color:t=16777215,vertexColors:s,linewidth:n,lineWidth:i,segments:a,dashed:r,...h},v){const m=he(o=>o.size),u=_.useMemo(()=>a?new ie:new ye,[a]),[p]=_.useState(()=>new V),M=s?.[0]&&s[0].length===4?4:3,b=[];e.forEach(o=>{o instanceof x?b.push(o.x,o.y,o.z):o instanceof Z?b.push(o.x,o.y,0):Array.isArray(o)?b.push(o[0],o[1],o.length===3?o[2]:0):b.push(o)});const E=s?.flatMap(o=>o instanceof me?o.toArray():[...o]),A=_.useRef({flat:[]}),O=(o,C)=>o===C||!!o&&!!C&&o.length===C.length&&o.every((se,oe)=>se===C[oe]),U=A.current;if(!U.g||U.segments!==a||!O(U.flat,b)||!O(U.colours,E)){const o=a?new G:new ne;o.setPositions(b),E&&o.setColors(E,M),A.current={flat:b,colours:E,segments:a,g:o}}const g=A.current.g;return _.useLayoutEffect(()=>{u.computeLineDistances()},[g,u]),_.useLayoutEffect(()=>{r?p.defines.USE_DASH="":delete p.defines.USE_DASH,p.needsUpdate=!0},[r,p]),_.useEffect(()=>()=>g.dispose(),[g]),_.useEffect(()=>()=>p.dispose(),[p]),R.jsxs("primitive",{object:u,ref:v,...h,children:[R.jsx("primitive",{object:g,attach:"geometry"}),R.jsx("primitive",{object:p,attach:"material",color:s?16777215:t,vertexColors:!!s,resolution:[m.width,m.height],linewidth:n??i??1,dashed:r,transparent:M===4,...h})]})});export{we as L,ee as v};
