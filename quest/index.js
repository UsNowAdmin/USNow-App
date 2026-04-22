// First-pass refactor: moved inline logic into dedicated files without changing the rendered UI.
// Expansion helper: every renderer treats topPills/bottomPills as arrays by default.
function ensureArray(value){ return Array.isArray(value) ? value : []; }

const starsEl=document.getElementById('stars');
for(let i=0;i<80;i++){const s=document.createElement('div');s.className='star';const sz=i%4===0?2:1;s.style.cssText=`left:${(i*43.1+11)%100}%;top:${(i*27.3+5)%58}%;width:${sz}px;height:${sz}px;opacity:${0.03+(i%5)*0.04};animation:tw ${3+(i%6)}s ease-in-out infinite;animation-delay:${(i%9)*0.35}s;`;starsEl.appendChild(s);}

function getLayerGeometry(idx,W,H){const totalH=LAYERS.reduce((s,l)=>s+l.height,0);let acc=0;for(let i=0;i<idx;i++)acc+=LAYERS[i].height;const fromBottomPct=acc/totalH;const heightPct=LAYERS[idx].height/totalH;const yBottom=H-fromBottomPct*H;const yTop=H-(fromBottomPct+heightPct)*H;const t=idx/(LAYERS.length-1);const sagTop=H*(0.11-t*0.065);const sagBottom=H*(0.03-t*0.018);const taper=W*0.03;const path=[`M ${-taper} ${yBottom}`,`Q ${W/2} ${yBottom+sagBottom} ${W+taper} ${yBottom}`,`L ${W+taper} ${yTop}`,`Q ${W/2} ${yTop+sagTop} ${-taper} ${yTop}`,`Z`].join(' ');return{path,yTop,yBottom,sagTop,topPct:1-fromBottomPct-heightPct,heightPct};}

function buildFoundationMoons(){
  // Remove any existing moons
  document.querySelectorAll('.foundation-moon').forEach(el=>el.remove());
  const coreWrap=document.getElementById('core-wrap');
  const coreBtnHeight=92;
  const W=window.innerWidth;
  const scale=Math.min(1, Math.max(0.38, W/780));
  FOUNDATIONS.forEach(f=>{
    const el=document.createElement('a');
    el.className='foundation-moon';
    el.href=f.href;
    // Position: centered on core-btn center, offset horizontally
    // core-wrap is centered, core-btn is 92px, core-orbs is 62px above
    // We position relative to core-wrap using absolute positioning
    const visiblePct=f.bottomPct/100; // how much shows above bottom
    const pushDown=f.size*(1-visiblePct); // how many px below bottom edge
    el.style.cssText=`
      width:${f.size}px;
      height:${f.size}px;
      background:${f.grad};
      border:2px solid ${f.border}bb;
      --fg:${f.glow};
      animation:ember 5s ease-in-out infinite;
      animation-delay:${f.delay}s;
      position:absolute;
      left:calc(50% + ${Math.round(f.offsetX * scale)}px);
      bottom:${-(f.size*(1-f.bottomPct/100))}px;
      transform:translateX(-50%);
      transition:transform 0.22s ease, box-shadow 0.22s ease;
    `;
    el.innerHTML=`<span style="font-size:9px;font-weight:700;letter-spacing:0.04em;color:#3a1e08;font-family:'Georgia','Times New Roman',serif;text-align:center;line-height:1.3;padding:4px;pointer-events:none;text-shadow:0 -1px 1px rgba(255,255,255,0.45),0 1px 0 rgba(0,0,0,0.4),0 2px 6px rgba(255,180,60,0.55),0 0 12px rgba(255,150,40,0.3),0 0 22px rgba(201,168,76,0.18);">${f.label.replace('\n','<br>')}</span>`;
    el.addEventListener('mouseenter',()=>{
      el.style.transform=`translateX(-50%) translateY(-8px) scale(1.09)`;
      el.style.boxShadow=`0 0 ${f.size*0.7}px ${f.glow},0 0 ${f.size*0.35}px ${f.border}88`;
    });
    el.addEventListener('mouseleave',()=>{
      el.style.transform=`translateX(-50%) translateY(0) scale(1)`;
      el.style.boxShadow='';
    });
    coreWrap.appendChild(el);
  });
}

function orbIdleGlow(el,sz,color){el.style.boxShadow=sphereGlow(color,sz);}
function orbHoverGlow(el,sz,color){el.style.cursor='pointer';el.style.transform='translate(-50%,-50%) scale(1.18)';el.style.zIndex='200';el.style.boxShadow=`0 0 ${sz*1.2}px ${color}cc,0 0 ${sz*0.6}px ${color}99,inset 0 0 ${sz*0.3}px rgba(0,0,0,0.3)`;el.style.border=`2px solid ${sphereBorder(color)}`;}
function orbIdleReset(el,sz,color){el.style.transform='translate(-50%,-50%) scale(1)';el.style.zIndex='20';el.style.border=`1.5px solid ${sphereBorder(color)}`;orbIdleGlow(el,sz,color);}
function orbActivePress(el,sz,color){el.style.transform='translate(-50%,-50%) scale(1.06)';el.style.boxShadow=`0 0 ${sz*0.7}px ${color}ff,0 0 ${sz*1.8}px ${color}55,inset 0 0 ${sz*0.5}px rgba(0,0,0,0.5)`;}
function attachOrbEvents(orbEl,orb,openFn){
  orbEl.style.cursor='pointer';
  // Mouse
  orbEl.addEventListener('mouseenter',()=>{orbHoverGlow(orbEl,orb.size,orb.color);});
  orbEl.addEventListener('mouseleave',()=>{orbIdleReset(orbEl,orb.size,orb.color);});
  orbEl.addEventListener('mousedown',()=>{orbActivePress(orbEl,orb.size,orb.color);});
  orbEl.addEventListener('mouseup',()=>{orbHoverGlow(orbEl,orb.size,orb.color);});
  orbEl.addEventListener('click',e=>{e.stopPropagation();e.stopImmediatePropagation();e.preventDefault();openFn();});
  // Touch
  let _tsx=0,_tsy=0,_tmoved=false;
  orbEl.addEventListener('touchstart',e=>{e.stopPropagation();_tsx=e.touches[0].clientX;_tsy=e.touches[0].clientY;_tmoved=false;orbHoverGlow(orbEl,orb.size,orb.color);},{passive:true});
  orbEl.addEventListener('touchmove',e=>{if(Math.abs(e.touches[0].clientX-_tsx)>8||Math.abs(e.touches[0].clientY-_tsy)>8){_tmoved=true;orbIdleReset(orbEl,orb.size,orb.color);}},{passive:true});
  orbEl.addEventListener('touchend',e=>{e.stopPropagation();if(_tmoved){orbIdleReset(orbEl,orb.size,orb.color);return;}e.preventDefault();orbActivePress(orbEl,orb.size,orb.color);requestAnimationFrame(()=>{orbIdleReset(orbEl,orb.size,orb.color);openFn();});});
}
// Sphere gradient — light source from lower-left (ME orb direction)
function sphereGrad(c){
  // c = hex color e.g. "#b05050"
  // Parse to get lighter and darker variants
  const h=c.replace('#','');
  const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
  const lighten=(v,a)=>Math.min(255,Math.round(v+a));
  const darken=(v,a)=>Math.max(0,Math.round(v-a));
  // Specular: near-white hot spot
  const spec=`rgba(255,255,255,0.76)`;
  // Highlight: lightened color
  const hl=`rgba(${lighten(r,70)},${lighten(g,70)},${lighten(b,53)},0.90)`;
  // Base: the color itself
  const base=`rgba(${r},${g},${b},1)`;
  // Shadow: darkened
  const shad=`rgba(${darken(r,60)},${darken(g,60)},${darken(b,50)},1)`;
  // Deep shadow
  const deep=`rgba(${darken(r,90)},${darken(g,90)},${darken(b,80)},1)`;
  // Rim: slight color glow on opposite edge
  const rim=`rgba(${lighten(r,40)},${lighten(g,40)},${lighten(b,50)},0.5)`;
  // Light from lower-left (~30% 72%), shadow upper-right
  return `radial-gradient(circle at 30% 68%, ${spec} 0%, ${spec} 4%, ${hl} 12%, ${base} 38%, ${shad} 68%, ${deep} 88%, ${rim} 100%)`;
}
function sphereBorder(c){
  const h=c.replace('#','');
  const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
  return `rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+50)},0.7)`;
}
function sphereGlow(c,sz){
  return `0 0 ${sz*0.5}px ${c}88, 0 0 ${sz*0.2}px ${c}55, inset 0 0 ${sz*0.25}px rgba(0,0,0,0.4)`;
}
function buildScale(){const section=document.getElementById('scale');const W=section.offsetWidth||1000;const H=section.offsetHeight||700;
// Desktop orb upsize: 1.0 on phones (<=640px), ramps to ~1.55 at desktop widths (>=1400px)
const orbScale = W<=640 ? 1 : Math.min(1.55, 1 + (W-640)*0.55/760);
const svg=document.getElementById('scale-svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);let defs='<defs>';LAYERS.forEach((layer,idx)=>{defs+=`<linearGradient id="grad${idx}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${layer.color}" stop-opacity="${0.04+(idx/(LAYERS.length-1))*0.08}"/><stop offset="100%" stop-color="${layer.color}" stop-opacity="${0.11+(idx/(LAYERS.length-1))*0.22}"/></linearGradient>`;});defs+='<filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter></defs>';let paths='';LAYERS.forEach((layer,idx)=>{const g=getLayerGeometry(idx,W,H);paths+=`<g><path d="${g.path}" fill="url(#grad${idx})"/><path d="M ${-10} ${g.yTop} Q ${W/2} ${g.yTop+g.sagTop} ${W+10} ${g.yTop}" fill="none" stroke="${layer.color}" stroke-width="0.8" stroke-opacity="0.55" filter="url(#glow)"/></g>`;});svg.innerHTML=defs+paths;
const bandsEl=document.getElementById('layer-bands');bandsEl.innerHTML='';LAYERS.forEach((layer,idx)=>{if(idx===0)return;const g=getLayerGeometry(idx,W,H);const div=document.createElement('div');div.className='layer-band';div.style.cssText=`top:${g.topPct*100}%;height:${g.heightPct*100}%;z-index:${idx+2};cursor:pointer;`;const fontSize=`clamp(9px,${1.1+idx*0.08}vw,13px)`;const labelBottom=layer.id==='family'?'0.75em':'6px';div.innerHTML=`<div class="layer-label-wrap" style="top:auto;bottom:${labelBottom};transform:translateX(-50%);z-index:150;pointer-events:none;"><div class="layer-main-label" style="font-size:${fontSize};color:${layer.color};text-shadow:0 0 20px ${layer.glow},0 0 40px ${layer.glow},0 1px 8px rgba(0,0,0,0.95),0 0 2px rgba(0,0,0,1);transition:all 0.25s ease;">${layer.label}</div></div>${layer.orbs.map(orb=>{const oz=Math.round(orb.size*orbScale);return `<div class="orb-node" data-orbid="${orb.id}" data-layeridx="${idx}" style="cursor:pointer;left:${orb.x}%;top:${orb.y}%;width:${oz}px;height:${oz}px;background:${sphereGrad(orb.color)};border:1.5px solid ${sphereBorder(orb.color)};box-shadow:${sphereGlow(orb.color,oz)};animation:${orb.pulse==='corrupt'?'pulseCorrupt 2.2s ease-in-out infinite':'orbf '+(3.2+(orb.size%4)*0.6)+'s ease-in-out infinite'};animation-delay:${(orb.size%8)*0.28}s;transition:transform 0.18s ease,box-shadow 0.18s ease,border 0.18s ease;"><span class="orb-label" style="font-size:${Math.max(8,oz*0.19)}px;">${orb.label}</span></div>`}).join('')}`;div.addEventListener('click',()=>openLayer(idx));div.querySelectorAll('.orb-node').forEach(orbEl=>{const layerIdx=parseInt(orbEl.dataset.layeridx);const orb=LAYERS[layerIdx].orbs.find(o=>o.id===orbEl.dataset.orbid);const scaledOrb={...orb,size:Math.round(orb.size*orbScale)};attachOrbEvents(orbEl,scaledOrb,()=>openOrb(orb,LAYERS[layerIdx]));});bandsEl.appendChild(div);});
const coreOrbs=document.getElementById('core-orbs');coreOrbs.innerHTML='';const positions=[{left:'5%',top:'72%'},{left:'26%',top:'16%'},{left:'50%',top:'78%'},{left:'74%',top:'14%'},{left:'92%',top:'68%'}];LAYERS[0].orbs.forEach((orb,i)=>{const pos=positions[i]||positions[0];const sz=Math.round(orb.size*0.57*orbScale);const scaledOrb={...orb,size:sz};const el=document.createElement('div');el.className='core-satellite';el.style.cssText=`cursor:pointer;left:${pos.left};top:${pos.top};width:${sz}px;height:${sz}px;background:${sphereGrad(orb.color)};border:1.5px solid ${sphereBorder(orb.color)};box-shadow:${sphereGlow(orb.color,sz)};transition:transform 0.18s ease,box-shadow 0.18s ease,border 0.18s ease;`;el.innerHTML=`<span style="font-size:${Math.max(7,sz*0.18)}px;color:rgba(255,255,255,0.88);font-family:'Courier New',monospace;text-align:center;line-height:1.15;padding:2px;pointer-events:none;">${orb.label}</span>`;attachOrbEvents(el,scaledOrb,()=>openOrb(orb,LAYERS[0]));coreOrbs.appendChild(el);});
buildFoundationMoons();}

// Build flat card index by id for bottomPill cross-reference navigation
window._cardIndex={};
(function buildIndex(items,layerData,orbData){
  if(!items)return;
  items.forEach(item=>{
    if(!item.id)return;
    const color=item.color||(orbData&&orbData.color)||(layerData&&layerData.color)||'#888';
    const hx=color.replace('#','');
    const r=parseInt(hx.slice(0,2),16),g=parseInt(hx.slice(2,4),16),b=parseInt(hx.slice(4,6),16);
    const glow=`rgba(${r},${g},${b},0.28)`;
    const tag=(orbData&&orbData.label)||(layerData&&layerData.label)||'';
    window._cardIndex[item.id]={color,glow,tag,scaleText:(layerData&&layerData.time)||null,title:item.label,sub:item.sub||null,desc:item.desc||'',links:item.links||[],topPills:item.topPills||[],bottomPills:item.bottomPills||[],isLayer:false};
    buildIndex(item.topPills,layerData,orbData||item);
    buildIndex(item.bottomPills,layerData,orbData||item);
  });
})(LAYERS.flatMap(l=>[...l.orbs,...(l.topPills||[])]),null,null);
LAYERS.forEach(layer=>{
  window._cardIndex[layer.id]={color:layer.color,glow:layer.glow,tag:layer.label,scaleText:layer.time,title:layer.label,sub:layer.sub||null,desc:layer.desc||'',links:layer.links||[],topPills:layer.topPills||[],bottomPills:layer.bottomPills||[],isLayer:true};
  layer.orbs.forEach(orb=>{
    const hx=orb.color.replace('#','');
    const r=parseInt(hx.slice(0,2),16),g=parseInt(hx.slice(2,4),16),b=parseInt(hx.slice(4,6),16);
    window._cardIndex[orb.id]={color:orb.color,glow:`rgba(${r},${g},${b},0.28)`,tag:layer.label,scaleText:layer.time,title:orb.label,sub:null,desc:orb.desc||'',links:orb.links||[],topPills:orb.topPills||[],bottomPills:orb.bottomPills||[],isLayer:false};
    (function indexDeep(pills,l,o){
      if(!pills)return;
      pills.forEach(p=>{
        if(!p.id)return;
        const c=p.color||o.color;const hx2=c.replace('#','');
        const r2=parseInt(hx2.slice(0,2),16),g2=parseInt(hx2.slice(2,4),16),b2=parseInt(hx2.slice(4,6),16);
        window._cardIndex[p.id]={color:c,glow:`rgba(${r2},${g2},${b2},0.28)`,tag:l.label,scaleText:l.time,title:p.label,sub:null,desc:p.desc||'',links:p.links||[],topPills:p.topPills||[],bottomPills:p.bottomPills||[],isLayer:false};
        indexDeep(p.topPills,l,o);
        indexDeep(p.bottomPills,l,o);
      });
    })(orb.topPills,layer,orb);
  });
});

function openLayer(idx){const layer=LAYERS[idx];window._currentLayer=layer;window._layerOrbsMap={};layer.orbs.forEach(o=>{window._layerOrbsMap[o.id]=o;});window._deepCards=window._deepCards||{};const bottomPills=layer.orbs.map(orb=>{const c=orb.color||layer.color;const hx=c.replace('#','');const r=parseInt(hx.slice(0,2),16),g=parseInt(hx.slice(2,4),16),b=parseInt(hx.slice(4,6),16);window._deepCards['bp_'+orb.id]=JSON.stringify({color:c,glow:`rgba(${r},${g},${b},0.28)`,tag:layer.label,scaleText:layer.time,title:orb.label,sub:null,desc:orb.desc,links:orb.links||[],topPills:orb.topPills||[],bottomPills:orb.bottomPills||[],isLayer:false,subcard:orb.subcard?{...orb.subcard,orbColor:orb.color}:null});return {id:orb.id,label:orb.label,color:c};});cardNavOpen({color:layer.color,glow:layer.glow,tag:layer.label,scaleText:layer.time,title:layer.label,sub:layer.sub,desc:layer.desc,links:layer.links||[],topPills:layer.topPills||[],bottomPills:bottomPills,isLayer:false,layer:layer});}
function openOrb(orb,layer){const c=orb.color||layer.color;const hx=c.replace('#','');const r=parseInt(hx.slice(0,2),16),g2=parseInt(hx.slice(2,4),16),b=parseInt(hx.slice(4,6),16);const og=`rgba(${r},${g2},${b},0.28)`;cardNavOpen({color:c,glow:og,tag:layer.label,scaleText:layer.time,title:orb.label,sub:null,desc:orb.desc,links:orb.links||[],topPills:orb.topPills||[],bottomPills:orb.bottomPills||[],isLayer:false});}

// Unified card navigation stack
window._cardStack=[];

function isSafari(){
  const ua=navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|CriOS|EdgiOS|FxiOS/i.test(ua);
}
function isZoomed(){
  return !!(window.visualViewport && window.visualViewport.scale>1.02);
}
function applyZoomedSafariModalMode(){
  const overlay=document.getElementById('modal-overlay');
  if(!overlay) return;
  if(isSafari() && isZoomed()) overlay.classList.add('zoomed-safari');
  else overlay.classList.remove('zoomed-safari');
}


function cardNavOpen(data){
  window._cardStack.push(data);
  renderCard(data);
  applyZoomedSafariModalMode();
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>{
    const box=document.getElementById('modal-box');
    if(box) box.scrollTop=0;
  });
}

function cardNavBack(){
  window._cardStack.pop();
  if(window._cardStack.length===0){
    const overlay=document.getElementById('modal-overlay');
    overlay.classList.remove('open');
    overlay.classList.remove('zoomed-safari');
    document.body.style.overflow='';
  } else {
    renderCard(window._cardStack[window._cardStack.length-1]);
    applyZoomedSafariModalMode();
  }
}

function cardNavClose(){
  window._cardStack=[];
  const overlay=document.getElementById('modal-overlay');
  if(overlay){
    overlay.classList.remove('open');
    overlay.classList.remove('zoomed-safari');
  }
  document.body.style.overflow='';
}

if(window.visualViewport){
  window.visualViewport.addEventListener('resize',()=>{
    if(document.getElementById('modal-overlay').classList.contains('open')){
      applyZoomedSafariModalMode();
    }
  });
}

function renderCard(data){
  const box=document.getElementById('modal-box');
  box.scrollTop=0;
  // Colors
  const hx=data.color.replace('#','');
  const r=parseInt(hx.slice(0,2),16),g=parseInt(hx.slice(2,4),16),b=parseInt(hx.slice(4,6),16);
  const lightenHex=(hex,amt)=>{
    const h=hex.replace('#','');
    const R=parseInt(h.slice(0,2),16),G=parseInt(h.slice(2,4),16),B=parseInt(h.slice(4,6),16);
    const mix=(c)=>Math.min(255,Math.round(c+(255-c)*amt));
    const toHex=(v)=>v.toString(16).padStart(2,'0');
    return '#'+toHex(mix(R))+toHex(mix(G))+toHex(mix(B));
  };
  const lc=lightenHex(data.color,0.45);
  document.getElementById('modal-drag').style.background=data.color+'77';
  box.style.border=`1px solid rgba(${r},${g},${b},0.55)`;
  box.style.boxShadow=`0 0 0 1px rgba(${r},${g},${b},0.18),0 -8px 60px rgba(${r},${g},${b},0.55),0 0 120px rgba(${r},${g},${b},0.25),inset 0 0 40px rgba(${r},${g},${b},0.07)`;
  document.getElementById('modal-glow-halo').style.background=`radial-gradient(ellipse,rgba(${r},${g},${b},0.55) 0%,rgba(${r},${g},${b},0.18) 45%,transparent 75%)`;
  // Header — 2 lines for layer/orb cards (tag + Scale: time), 1 line for subcards
  const tagEl=document.getElementById('modal-layer-tag');
  tagEl.style.color=lc;
  if(data.scaleText){
    tagEl.innerHTML=`<span style="display:block;">${data.tag}</span><span style="display:block;font-size:8px;letter-spacing:0.18em;opacity:0.6;margin-top:2px;">Scale: ${data.scaleText}</span>`;
  } else {
    tagEl.textContent=data.tag;
  }
  // Close / Back button
  const closeBtn=document.getElementById('modal-close');
  const isRoot=window._cardStack.length<=1;
  closeBtn.textContent=isRoot?'CLOSE':'← BACK';
  closeBtn.style.color=lc;
  closeBtn.style.border=`1px solid ${data.color}66`;
  closeBtn.onmouseenter=()=>{closeBtn.style.background=`${data.color}22`;};
  closeBtn.onmouseleave=()=>{closeBtn.style.background='transparent';};
  // Title / subtitle / desc
  document.getElementById('modal-title').textContent=data.title;
  const subEl=document.getElementById('modal-sub');
  if(data.sub){subEl.style.color=lc;subEl.style.opacity='0.9';subEl.textContent=data.sub;subEl.style.display='block';}else{subEl.style.display='none';}
  document.getElementById('modal-desc').textContent=data.desc;
  // TOP PILLS — topPills[] array + legacy subcard
  const topSection=document.getElementById('modal-toppills-section');
  const topList=document.getElementById('modal-toppills-list');
  let topPills=[];
  if(data.topPills&&data.topPills.length>0){
    window._deepCards=window._deepCards||{};
    data.topPills.forEach(d=>{
      const c=d.color||data.color;const cl=lightenHex(c,0.45);
      const key='dp_'+d.id;
      window._deepCards[key]=JSON.stringify({color:c,glow:data.glow,tag:data.title,scaleText:null,title:d.label,sub:null,desc:d.desc||'',links:d.links||[],bottomPills:d.bottomPills||[],topPills:d.topPills||[],isLayer:false});
      topPills.push(`<span class="modal-orb-tag" style="color:${cl};background:${c}28;border:1px solid ${c}66;" onclick="cardNavOpen(JSON.parse(window._deepCards['${key}']));"><span class="modal-orb-dot" style="background:${sphereGrad(c)};border:1px solid ${sphereBorder(c)};"></span>${d.label}</span>`);
    });
  }
  if(topPills.length>0){topSection.style.display='block';topList.innerHTML=topPills.join('');}else{topSection.style.display='none';}
  // BOTTOM PILLS — uniform across all card types; layer cards pre-build entries in openLayer
  const botSection=document.getElementById('modal-bottompills-section');
  const botList=document.getElementById('modal-bottompills-list');
  let botPills=[];
  const bpSource=data.bottomPills||[];
  if(bpSource.length>0){
    window._deepCards=window._deepCards||{};
    botPills=bpSource.map(o=>{
      // Resolve from card index first — gets full card with correct color and content
      const resolved=(window._cardIndex&&window._cardIndex[o.id])||{color:o.color||data.color,glow:data.glow,tag:data.title,scaleText:null,title:o.label,sub:null,desc:o.desc||'',links:o.links||[],topPills:o.topPills||[],bottomPills:o.bottomPills||[],isLayer:false};
      const resolvedColor=resolved.color||data.color;
      const bg=resolvedColor+'28';const border=resolvedColor+'66';const ol=lightenHex(resolvedColor,0.45);
      const key='bp_idx_'+o.id;
      window._deepCards[key]=JSON.stringify(resolved);
      return `<span class="modal-orb-tag" style="color:${ol};background:${bg};border:1px solid ${border};" onclick="cardNavOpen(JSON.parse(window._deepCards['${key}']));"><span class="modal-orb-dot" style="background:${sphereGrad(resolvedColor)};border:1px solid ${sphereBorder(resolvedColor)};"></span>${o.label}</span>`;
    });
  }
  if(botPills.length>0){botSection.style.display='block';const bpLbl=document.getElementById('modal-bottompills-label');if(bpLbl){bpLbl.style.color=lc;}botList.innerHTML=botPills.join('');}else{botSection.style.display='none';}
  // OTHER LINKS & CONNECTIONS — links[] merged with beyond[] (tagged items shown with tag)
  const linksDiv=document.getElementById('modal-links');
  document.getElementById('modal-links-label').style.color=lc;
  const allLinks=[...(data.links||[]),...(data.beyond||[])];
  if(allLinks.length>0){
    linksDiv.style.display='block';
    document.getElementById('modal-links-list').innerHTML=allLinks.map(l=>{
      const isTracker=l.url&&l.url.includes('corruption_tracker');
      if(isTracker){return `<a href="${l.url}" target="_blank" rel="noreferrer" class="modal-link" style="color:#f0a060;border:1px solid #d4621a88;background:rgba(212,98,26,0.12);animation:pulseCorrupt 2.2s ease-in-out infinite;font-weight:700;letter-spacing:0.12em;" onmouseenter="this.style.background='rgba(212,98,26,0.22)';this.style.borderColor='#f0a060cc';" onmouseleave="this.style.background='rgba(212,98,26,0.12)';this.style.borderColor='#d4621a88';"><span style="opacity:1;">◆</span> ${l.label}</a>`;}
      return `<a href="${l.url}" target="_blank" rel="noreferrer" class="modal-link"><span style="font-size:18px;line-height:1;">${l.emoji||'🔗'}</span><div><div style="font-size:12px;color:#f0ece4;font-family:'Georgia',serif;line-height:1.3;">${l.label}</div>${l.tag?`<div style="font-size:8px;color:#5a6a7a;font-family:'Courier New',monospace;letter-spacing:0.14em;margin-top:2px;">${l.tag}</div>`:''}</div></a>`;
    }).join('');
  }else{linksDiv.style.display='none';}
}

function closeModal(){cardNavClose();}
function closeSubcard(){cardNavBack();}

function submitThought(){
  const note=document.getElementById('t-note').value.trim();
  if(!note){document.getElementById('t-note').style.borderBottomColor='rgba(212,98,26,0.7)';document.getElementById('t-note').focus();return;}
  const ENDPOINT='https://script.google.com/macros/s/AKfycbwgKSDLQT9c5L4sz4g791w4C_fT9M8zV9r3PlnzyFaAqhigD0Cg265fI17QLoEp-83Q/exec';
  fetch(ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('t-email').value||'anonymous',topic:note,why:'',sources:'',submitted:new Date().toISOString()})});
  document.getElementById('t-email').value='';document.getElementById('t-note').value='';
  const c=document.getElementById('t-confirm');c.style.opacity='1';setTimeout(()=>c.style.opacity='0',3000);
}

function openNavForm(){
  document.getElementById('nav-contact-btn').style.display='none';
  document.getElementById('nav-sign').style.opacity='0';
  document.getElementById('nav-sign').style.pointerEvents='none';
  const wrap=document.getElementById('nav-form-wrap');
  wrap.style.display='flex';
  setTimeout(()=>document.getElementById('nav-note').focus(),50);
}

function submitNavThought(){
  const note=document.getElementById('nav-note').value.trim();
  if(!note){document.getElementById('nav-note').style.borderBottomColor='rgba(212,98,26,0.7)';document.getElementById('nav-note').focus();return;}
  const ENDPOINT='https://script.google.com/macros/s/AKfycbwgKSDLQT9c5L4sz4g791w4C_fT9M8zV9r3PlnzyFaAqhigD0Cg265fI17QLoEp-83Q/exec';
  fetch(ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('nav-email').value||'anonymous',topic:note,why:'',sources:'',submitted:new Date().toISOString()})});
  document.getElementById('nav-email').value='';
  document.getElementById('nav-note').value='';
  // Hide fields, show popup
  document.getElementById('nav-form-wrap').style.display='none';
  const popup=document.getElementById('nav-confirm');
  popup.style.display='block';
  setTimeout(()=>{
    popup.style.display='none';
    // Restore sign and button
    const sign=document.getElementById('nav-sign');
    sign.style.opacity='1';
    document.getElementById('nav-contact-btn').style.display='';
  },3500);
}

document.addEventListener('keydown',e=>{if(e.key==='Escape')cardNavBack();});
const _days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];const _months=['January','February','March','April','May','June','July','August','September','October','November','December'];const _now=new Date();document.getElementById('hero-date').textContent=`${_days[_now.getDay()].toUpperCase()} · ${_months[_now.getMonth()].toUpperCase()} ${_now.getDate()}, ${_now.getFullYear()}`;
buildScale();
let resizeTimer;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(buildScale,120);});