(()=>{
  const cache=new Map();
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m]));
  function spriteSvg(sex,accent){
    const female=sex==='female';
    const hair=female?'#ead0cc':'#2b2931';
    const hair2=female?'#cfaeaa':'#17171c';
    const eye=female?'#b94e62':'#3478c8';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 260">
    <defs>
      <linearGradient id="hood" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dfe5ed"/></linearGradient>
      <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${esc(accent)}"/><stop offset="1" stop-color="#1d2430"/></linearGradient>
      <radialGradient id="skin"><stop stop-color="#ffe8db"/><stop offset="1" stop-color="#edc7b8"/></radialGradient>
      <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-opacity=".35"/></filter>
    </defs>
    <ellipse cx="110" cy="238" rx="50" ry="11" fill="#000" opacity=".28"/>
    ${female?`<path d="M154 59c34 10 42 45 31 78-7 21-20 40-39 48 10-24 8-48-4-70-9-16-7-40 12-56z" fill="${hair}" stroke="#8d6c6b" stroke-width="5"/><path d="M145 57c18-13 39-1 44 15-11-3-20 0-27 8z" fill="${esc(accent)}" stroke="#4b3340" stroke-width="4"/>`:''}
    <g filter="url(#sh)">
      <path d="M70 155c-14 8-24 23-26 42l26 8 12-33z" fill="url(#acc)" stroke="#20242c" stroke-width="5"/>
      <path d="M150 155c14 8 24 23 26 42l-26 8-12-33z" fill="url(#acc)" stroke="#20242c" stroke-width="5"/>
      <path d="M72 148q38-23 76 0l10 68q-48 22-96 0z" fill="url(#hood)" stroke="#20242c" stroke-width="6"/>
      <path d="M74 178h72" stroke="${esc(accent)}" stroke-width="13" stroke-linecap="round"/>
      <path d="M92 150l18 21 18-21" fill="none" stroke="${esc(accent)}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M99 213l-8 24" stroke="#252934" stroke-width="16" stroke-linecap="round"/><path d="M123 213l8 24" stroke="#252934" stroke-width="16" stroke-linecap="round"/>
      <path d="M75 237q20-11 35 1l-6 14H72q-5-8 3-15z" fill="${esc(accent)}" stroke="#1a1d25" stroke-width="5"/>
      <path d="M145 237q-20-11-35 1l6 14h32q5-8-3-15z" fill="${esc(accent)}" stroke="#1a1d25" stroke-width="5"/>
      <circle cx="110" cy="95" r="55" fill="url(#skin)" stroke="#6b4b49" stroke-width="5"/>
      ${female?`<path d="M59 99c-7-55 26-84 71-77 37 6 52 34 43 70-8-16-23-24-38-29-18-6-34-18-49-3-10 10-16 25-27 39z" fill="${hair}" stroke="#8d6c6b" stroke-width="5"/><path d="M70 70c6 17 9 28 7 45 12-8 18-21 20-35 10 15 18 25 33 32 0-15-4-28-12-39 15 10 27 14 42 12-9-30-40-48-68-39z" fill="${hair2}" opacity=".55"/>`:`<path d="M56 94c-3-42 22-74 64-75 34-1 58 18 63 54-10-10-21-15-34-17 7 8 10 18 9 29-12-15-25-23-39-27 2 14-4 27-16 38 0-16-6-27-14-36-4 16-14 29-33 34z" fill="${hair}" stroke="#111218" stroke-width="5"/><path d="M72 45l-12-18 26 7 9-22 12 23 24-18-5 25 29-2-21 18z" fill="${hair}" stroke="#111218" stroke-width="5" stroke-linejoin="round"/>`}
      <path d="M65 80q46-39 92-2" fill="none" stroke="${esc(accent)}" stroke-width="7" stroke-linecap="round"/>
      ${female?`<path d="M156 68l20-15-4 22 18 6-20 9z" fill="${esc(accent)}" stroke="#5b3642" stroke-width="4"/>`:`<path d="M61 71l-24 13 18 7-8 22 27-18z" fill="${esc(accent)}" stroke="#18294a" stroke-width="4"/>`}
      <ellipse cx="88" cy="103" rx="12" ry="16" fill="#fff"/><ellipse cx="132" cy="103" rx="12" ry="16" fill="#fff"/>
      <ellipse cx="90" cy="105" rx="7" ry="11" fill="${eye}"/><ellipse cx="134" cy="105" rx="7" ry="11" fill="${eye}"/>
      <circle cx="92" cy="101" r="3" fill="#fff"/><circle cx="136" cy="101" r="3" fill="#fff"/>
      <path d="M101 125q9 8 18 0" fill="none" stroke="#b45d69" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="75" cy="120" rx="10" ry="6" fill="#f3a8ad" opacity=".45"/><ellipse cx="145" cy="120" rx="10" ry="6" fill="#f3a8ad" opacity=".45"/>
    </g></svg>`;
  }
  function getImage(sex,accent){
    const key=sex+'|'+accent;
    if(cache.has(key))return cache.get(key);
    const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(spriteSvg(sex,accent));cache.set(key,img);return img;
  }
  function draw(g,p,x,y,s,preview=false){
    const sex=p.charSex==='female'?'female':'male',accent=p.charColor||'#4f8cff',img=getImage(sex,accent);
    const w=s*1.15,h=s*1.42;
    g.save();g.globalAlpha=p.connected===false?.35:1;
    if(img.complete)g.drawImage(img,x-w/2,y-h*.72,w,h);
    if(!preview&&p.name){g.fillStyle='#fff';g.font=`700 ${Math.max(11,s*.28)}px system-ui`;g.textAlign='center';g.shadowColor='#000';g.shadowBlur=4;g.fillText(p.name,x,y-h*.76)}
    g.restore();
  }
  function init(){
    if(typeof person!=='function')return;
    person=function(p,x,y,s,side=false){
      if(!side&&phase==='lobby'&&p.jumpUntil&&p.jumpUntil>Date.now()){const r=Math.max(0,Math.min(600,p.jumpUntil-Date.now())),q=1-r/600;y-=Math.sin(q*Math.PI)*s*.28}
      draw(ctx,p,x,y,s,false,false);
    };
    function preview(){const modal=document.getElementById('charModal'),cv=document.getElementById('charPreview');if(modal&&cv&&modal.style.display!=='none'){const p=players.get(myId)||{charSex:localStorage.getItem('saiCharSex')||'male',charColor:localStorage.getItem('saiCharColor')||'#4f8cff',connected:true};const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);c.fillStyle='#0c1220';c.fillRect(0,0,cv.width,cv.height);draw(c,p,110,105,104,true)}requestAnimationFrame(preview)}
    requestAnimationFrame(preview);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();