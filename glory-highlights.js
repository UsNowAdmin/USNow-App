// ── Glory Highlights — definitions loaded from glories.js ──

// Build regex from word list — whole words only, case insensitive
const _words = Object.keys(GLORIES).sort((a,b)=>b.length-a.length);
const _re = new RegExp('\\b(' + _words.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|') + ')\\b','gi');

function applyGlories(root){
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n){
      const p = n.parentElement;
      if(!p) return NodeFilter.FILTER_REJECT;
      const tag = p.tagName;
      if(['SCRIPT','STYLE','A','BUTTON','INPUT'].includes(tag)) return NodeFilter.FILTER_REJECT;
      if(p.classList&&p.classList.contains('glory-word')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes=[];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node=>{
    if(!_re.test(node.textContent)) return;
    _re.lastIndex=0;
    const frag = document.createDocumentFragment();
    let last=0, m;
    _re.lastIndex=0;
    while((m=_re.exec(node.textContent))!==null){
      if(m.index>last) frag.appendChild(document.createTextNode(node.textContent.slice(last,m.index)));
      const span=document.createElement('span');
      span.className='glory-word';
      span.textContent=m[0];
      span.dataset.glory=m[0].charAt(0).toUpperCase()+m[0].slice(1).toLowerCase();
      frag.appendChild(span);
      last=_re.lastIndex;
    }
    if(last<node.textContent.length) frag.appendChild(document.createTextNode(node.textContent.slice(last)));
    node.parentNode.replaceChild(frag,node);
  });
}

// Pop-up logic — capture phase so it fires before modal-box stopPropagation
const pop=document.getElementById('glory-pop');
document.addEventListener('click',e=>{
  const t=e.target.closest('.glory-word');
  if(t){
    e.stopPropagation();
    const key=t.dataset.glory;
    const def=GLORIES[key]||GLORIES[Object.keys(GLORIES).find(k=>k.toLowerCase()===key.toLowerCase())];
    if(!def) return;
    document.getElementById('gp-word').textContent=key.toUpperCase();
    document.getElementById('gp-def').textContent=def;
    document.getElementById('gp-link').href='compendium.html#'+key.toLowerCase();
    // Position near word
    const r=t.getBoundingClientRect();
    const pw=280, ph=120;
    let left=r.left, top=r.bottom+8;
    if(left+pw>window.innerWidth-10) left=window.innerWidth-pw-10;
    if(top+ph>window.innerHeight-10) top=r.top-ph-8;
    pop.style.left=Math.max(8,left)+'px';
    pop.style.top=Math.max(8,top)+'px';
    pop.style.display='block';
    return;
  }
  if(!e.target.closest('#glory-pop')) pop.style.display='none';
},true);

// Apply to static content on load
window.addEventListener('load',()=>{
  ['hero','about','thoughts'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) applyGlories(el);
  });
});

// Apply to modal content after render
const _origRender=window.renderCard;
window.renderCard=function(data){
  _origRender(data);
  setTimeout(()=>{
    const desc=document.getElementById('modal-desc');
    if(desc) applyGlories(desc);
  },50);
};