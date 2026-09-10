(()=>{
  const cache=new Map();
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&apos;'}[m]));
  function spriteSvg(sex,accent){
    const female=sex==='female',a=esc(accent);
    const hair=female?'#ead1cc':'#292832',hairShade=female?'#c79f9b':'#15151b',hairHi=female?'#fff0ec':'#4a4754';
    const eye=female?'#c94d69':'#3f86dd';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 280">
    <defs>
      <linearGradient id="hood" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffffff"/><stop offset=".55" stop-color="#e9edf3"/><stop offset="1" stop-color="#cbd3df"/></linearGradient>
      <linearGradient id="acc" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="#172033"/></linearGradient>
      <linearGradient id="pants" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#303644"/><stop offset="1" stop-color="#161a22"/></linearGradient>
      <radialGradient id="skin" cx="40%" cy="30%"><stop stop-color="#fff0e6"/><stop offset="1" stop-color="#e9bdad"/></radialGradient>
      <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-opacity=".38"/></filter>
      <filter id="soft"><feGaussianBlur stdDeviation="1.2"/></filter>
    </defs>
    <ellipse cx="120" cy="257" rx="55" ry="12" fill="#000" opacity=".3" filter="url(#soft)"/>
    ${female?`<path d="M164 60c36 4 49 32 43 68-5 32-21 62-48 76 10-29 6-54-8-78-12-20-8-52 13-66z" fill="${hairShade}" opacity=".55"/><path d="M159 57c31 4 43 30 37 64-5 27-18 52-39 66 7-27 2-48-9-69-10-18-6-47 11-61z" fill="${hair}" stroke="#7b5557" stroke-width="4"/>`:''}
    <g filter="url(#shadow)">
      <path d="M78 170c-18 9-31 26-35 48l29 11 19-42z" fill="url(#acc)" stroke="#202632" stroke-width="5"/>
      <path d="M162 170c18 9 31 26 35 48l-29 11-19-42z" fill="url(#acc)" stroke="#202632" stroke-width="5"/>
      <path d="M80 158q40-25 80 0l12 72q-52 24-104 0z" fill="url(#hood)" stroke="#202632" stroke-width="6"/>
      <path d="M84 174q36 10 72 0" fill="none" stroke="#b8c2d1" stroke-width="3" opacity=".8"/>
      <path d="M83 190h74" stroke="${a}" stroke-width="12" stroke-linecap="round"/>
      <path d="M97 162l23 25 23-25" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="111" cy="176" r="3" fill="#7a8495"/><circle cx="129" cy="176" r="3" fill="#7a8495"/>
      <path d="M108 227l-9 27" stroke="url(#pants)" stroke-width="18" stroke-linecap="round"/><path d="M132 227l9 27" stroke="url(#pants)" stroke-width="18" stroke-linecap="round"/>
      <path d="M80 249q22-13 39 1l-7 18H76q-7-10 4-19z" fill="${a}" stroke="#161a22" stroke-width="5"/><path d="M160 249q-22-13-39 1l7 18h36q7-10-4-19z" fill="${a}" stroke="#161a22" stroke-width="5"/>
      <path d="M79 259h36" stroke="#fff" stroke-width="4" opacity=".8"/><path d="M125 259h36" stroke="#fff" stroke-width="4" opacity=".8"/>
      <circle cx="120" cy="103" r="60" fill="url(#skin)" stroke="#684847" stroke-width="5"/>
      ${female?`<path d="M64 104c-8-59 28-92 77-84 41 7 58 38 48 77-10-18-27-28-44-33-19-6-36-18-51-3-12 12-18 29-30 43z" fill="${hair}" stroke="#805a5c" stroke-width="5"/><path d="M75 65c8 18 11 34 8 53 13-9 21-24 23-41 12 17 20 30 37 38 0-18-5-33-15-46 17 12 31 17 47 14-12-34-46-54-77-43z" fill="${hairShade}" opacity=".65"/><path d="M91 44q17-14 35-9" stroke="${hairHi}" stroke-width="6" stroke-linecap="round" opacity=".65" fill="none"/>`:`<path d="M61 101c-4-47 24-82 70-83 37-1 64 21 69 61-11-11-24-17-38-19 8 9 12 20 11 32-13-17-28-26-44-30 3 16-4 31-17 43 0-18-7-31-16-41-5 18-16 33-35 37z" fill="${hair}" stroke="#111219" stroke-width="5"/><path d="M78 49l-13-22 28 9 9-25 14 26 27-19-6 27 32-3-23 21z" fill="${hair}" stroke="#111219" stroke-width="5" stroke-linejoin="round"/><path d="M84 41q22-12 39-7" stroke="${hairHi}" stroke-width="6" stroke-linecap="round" opacity=".55" fill="none"/>`}
      <path d="M70 84q49-42 100-3" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round"/>
      ${female?`<path d="M169 69l22-16-5 23 20 7-22 10z" fill="${a}" stroke="#5b3642" stroke-width="4"/><path d="M177 70l13 4" stroke="#fff" stroke-width="3" opacity=".55"/>`:`<path d="M66 75L39 90l20 8-9 24 30-20z" fill="${a}" stroke="#18294a" stroke-width="4"/><path d="M51 90l17 6" stroke="#fff" stroke-width="3" opacity=".5"/>`}
      <path d="M78 95q14-10 29 0" stroke="#3d2f35" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M133 95q14-10 29 0" stroke="#3d2f35" stroke-width="4" stroke-linecap="round" fill="none"/>
      <ellipse cx="94" cy="111" rx="14" ry="18" fill="#fff"/><ellipse cx="146" cy="111" rx="14" ry="18" fill="#fff"/>
      <ellipse cx="97" cy="113" rx="9" ry="13" fill="${eye}"/><ellipse cx="149" cy="113" rx="9" ry="13" fill="${eye}"/>
      <ellipse cx="98" cy="116" rx="5" ry="8" fill="#111827" opacity=".65"/><ellipse cx="150" cy="116" rx="5" ry="8" fill="#111827" opacity=".65"/>
      <circle cx="101" cy="107" r="4" fill="#fff"/><circle cx="153" cy="107" r="4" fill="#fff"/><circle cx="95" cy="119" r="2" fill="#fff" opacity=".75"/><circle cx="147" cy="119" r="2" fill="#fff" opacity=".75"/>
      <path d="M91 136q29 10 58 0" fill="none" stroke="#d88b8d" stroke-width="3" opacity=".35"/>
      <path d="M110 139q10 9 20 0" fill="none" stroke="#a94f5d" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="79" cy="132" rx="12" ry="7" fill="#f3a8ad" opacity=".38"/><ellipse cx="161" cy="132" rx="12" ry="7" fill="#f3a8ad" opacity=".38"/>
      <path d="M91 151q29 9 58 0" stroke="#fff" opacity=".22" stroke-width="3" fill="none"/>
    </g></svg>`;
  }
  function getImage(sex,accent){const key=sex+'|'+accent;if(cache.has(key))return cache.get(key);const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(spriteSvg(sex,accent));cache.set(key,img);return img}
  function draw(g,p,x,y,s,preview=false){const sex=p.charSex==='female'?'female':'male',accent=p.charColor||'#4f8cff',img=getImage(sex,accent),w=s*1.18,h=s*1.5;g.save();g.globalAlpha=p.connected===false?.35:1;if(img.complete)g.drawImage(img,x-w/2,y-h*.73,w,h);if(!preview&&p.name){g.fillStyle='#fff';g.font=`800 ${Math.max(11,s*.28)}px system-ui`;g.textAlign='center';g.shadowColor='#000';g.shadowBlur=5;g.fillText(p.name,x,y-h*.79)}g.restore()}
  function init(){if(typeof person!=='function')return;person=function(p,x,y,s,side=false){if(!side&&phase==='lobby'&&p.jumpUntil&&p.jumpUntil>Date.now()){const r=Math.max(0,Math.min(600,p.jumpUntil-Date.now())),q=1-r/600;y-=Math.sin(q*Math.PI)*s*.28}draw(ctx,p,x,y,s,false)};function preview(){const modal=document.getElementById('charModal'),cv=document.getElementById('charPreview');if(modal&&cv&&modal.style.display!=='none'){const p=players.get(myId)||{charSex:localStorage.getItem('saiCharSex')||'male',charColor:localStorage.getItem('saiCharColor')||'#4f8cff',connected:true};const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);c.fillStyle='#0c1220';c.fillRect(0,0,cv.width,cv.height);draw(c,p,110,105,108,true)}requestAnimationFrame(preview)}requestAnimationFrame(preview)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();