(()=>{
  const CHAR_PREFIX='§CHAR|';
  const COLORS=['#4f8cff','#ef5350','#22c55e','#a855f7','#f59e0b','#ec4899','#14b8a6','#f3f4f6'];
  let prefs={sex:localStorage.getItem('saiCharSex')||'male',color:localStorage.getItem('saiCharColor')||'#4f8cff'};

  function savePrefs(){localStorage.setItem('saiCharSex',prefs.sex);localStorage.setItem('saiCharColor',prefs.color)}
  function me(){return typeof players!=='undefined'&&players.get(myId)}
  function applyChar(id,sex,color){const p=players.get(id);if(!p)return;p.charSex=sex==='female'?'female':'male';p.charColor=/^#[0-9a-f]{6}$/i.test(color||'')?color:'#4f8cff'}
  function parseChar(m){if(!m||m.type!=='chat'||typeof m.text!=='string'||!m.text.startsWith(CHAR_PREFIX))return false;const a=m.text.split('|');applyChar(m.id,a[1],a[2]);return true}
  function sendPrefs(){const p=me();if(p){applyChar(myId,prefs.sex,prefs.color);send({type:'chat',text:CHAR_PREFIX+prefs.sex+'|'+prefs.color})}}

  function ensureCustomizer(){
    if(document.getElementById('charCustomizeBtn'))return;
    const card=document.querySelector('.lobbyCard');if(!card)return;
    const btn=document.createElement('button');btn.id='charCustomizeBtn';btn.type='button';btn.textContent='캐릭터 꾸미기';
    btn.style.cssText='margin:0 0 8px;padding:9px;background:#20293a;color:#fff;border:1px solid #ffffff24';
    card.insertBefore(btn,document.getElementById('startBtn'));
    const modal=document.createElement('div');modal.id='charModal';modal.innerHTML=`<div class="charBox"><div class="charTitle">캐릭터 꾸미기</div><canvas id="charPreview" width="220" height="170"></canvas><div class="charLabel">캐릭터</div><div class="charSex"><button type="button" data-sex="male">남캐</button><button type="button" data-sex="female">여캐</button></div><div class="charLabel">포인트 색상</div><div class="charColors"></div><button type="button" id="charClose">완료</button></div>`;
    document.body.appendChild(modal);
    const st=document.createElement('style');st.textContent=`
      #charModal{position:fixed;inset:0;z-index:40;background:#000b;display:none;place-items:center;pointer-events:auto;padding:16px}
      .charBox{width:min(92vw,360px);padding:16px;border-radius:18px;background:#151b27;border:1px solid #ffffff25;box-shadow:0 18px 60px #0008}
      .charTitle{font-size:21px;font-weight:950;text-align:center;margin-bottom:8px}.charLabel{font-size:12px;color:#aab2c0;font-weight:800;margin:10px 0 6px}
      #charPreview{display:block;width:220px;height:170px;max-width:100%;margin:auto;border-radius:14px;background:#0c1220}
      .charSex{display:grid;grid-template-columns:1fr 1fr;gap:7px}.charSex button{margin:0;padding:10px;background:#222a39;color:#fff}.charSex button.sel{background:#fff;color:#111}
      .charColors{display:grid;grid-template-columns:repeat(8,1fr);gap:7px}.charSwatch{aspect-ratio:1;padding:0!important;margin:0!important;border-radius:50%!important;border:2px solid #ffffff33!important}.charSwatch.sel{outline:3px solid #fff;outline-offset:2px}
      #charClose{margin-top:14px}
    `;document.head.appendChild(st);
    const colors=modal.querySelector('.charColors');COLORS.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='charSwatch';b.dataset.color=c;b.style.background=c;colors.appendChild(b)});
    btn.onclick=()=>{modal.style.display='grid';renderCustomizer()};
    document.getElementById('charClose').onclick=()=>{modal.style.display='none';sendPrefs()};
    modal.addEventListener('click',e=>{const sx=e.target.closest('[data-sex]');if(sx){prefs.sex=sx.dataset.sex;savePrefs();applyChar(myId,prefs.sex,prefs.color);renderCustomizer();sendPrefs()}const sw=e.target.closest('[data-color]');if(sw){prefs.color=sw.dataset.color;savePrefs();applyChar(myId,prefs.sex,prefs.color);renderCustomizer();sendPrefs()}});
  }

  function renderCustomizer(){
    const modal=document.getElementById('charModal');if(!modal)return;
    modal.querySelectorAll('[data-sex]').forEach(b=>b.classList.toggle('sel',b.dataset.sex===prefs.sex));
    modal.querySelectorAll('[data-color]').forEach(b=>b.classList.toggle('sel',b.dataset.color.toLowerCase()===prefs.color.toLowerCase()));
    const cv=document.getElementById('charPreview'),c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);c.fillStyle='#0c1220';c.fillRect(0,0,cv.width,cv.height);
    drawChibi(c,{name:'미리보기',charSex:prefs.sex,charColor:prefs.color,connected:true,dirX:1,dirY:0},110,103,92,false,true);
  }

  function drawChibi(g,p,x,y,s,side=false,preview=false){
    g.save();g.globalAlpha=p.connected===false?.35:1;
    const accent=p.charColor||'#4f8cff',female=p.charSex==='female';
    const face='#f4d8ca',hair=female?'#e8c3bd':'#29262d',dark='#1b1f28';
    const headY=y-s*.32,headR=s*.24;
    // shadow
    g.fillStyle='#0005';g.beginPath();g.ellipse(x,y+s*.38,s*.27,s*.08,0,0,Math.PI*2);g.fill();
    // ponytail for female
    if(female){g.fillStyle=hair;g.beginPath();g.ellipse(x+s*.23,headY-s*.02,s*.13,s*.25,-.15,0,Math.PI*2);g.fill();g.strokeStyle=accent;g.lineWidth=Math.max(2,s*.035);g.beginPath();g.arc(x+s*.16,headY-s*.13,s*.09,0,Math.PI*1.5);g.stroke()}
    // legs/shoes
    g.strokeStyle=dark;g.lineWidth=s*.13;g.lineCap='round';g.beginPath();g.moveTo(x-s*.1,y+s*.13);g.lineTo(x-s*.12,y+s*.34);g.moveTo(x+s*.1,y+s*.13);g.lineTo(x+s*.12,y+s*.34);g.stroke();
    g.strokeStyle=accent;g.lineWidth=s*.09;g.beginPath();g.moveTo(x-s*.12,y+s*.34);g.lineTo(x-s*.22,y+s*.36);g.moveTo(x+s*.12,y+s*.34);g.lineTo(x+s*.22,y+s*.36);g.stroke();
    // hoodie body
    g.fillStyle='#f5f6f8';g.beginPath();g.roundRect(x-s*.25,y-s*.09,s*.5,s*.36,s*.12);g.fill();g.fillStyle=accent;g.fillRect(x-s*.25,y+s*.02,s*.5,s*.075);
    g.strokeStyle=accent;g.lineWidth=s*.075;g.beginPath();g.moveTo(x-s*.21,y-s*.02);g.lineTo(x-s*.35,y+s*.13);g.moveTo(x+s*.21,y-s*.02);g.lineTo(x+s*.35,y+s*.13);g.stroke();
    // head
    g.fillStyle=face;g.beginPath();g.arc(x,headY,headR,0,Math.PI*2);g.fill();
    // hair cap + bangs
    g.fillStyle=hair;g.beginPath();g.arc(x,headY-s*.055,headR*1.03,Math.PI,Math.PI*2);g.lineTo(x+headR*.92,headY);g.quadraticCurveTo(x+headR*.35,headY-s*.13,x+headR*.12,headY-s*.02);g.quadraticCurveTo(x-headR*.1,headY-s*.15,x-headR*.3,headY-s*.01);g.quadraticCurveTo(x-headR*.55,headY-s*.11,x-headR*.92,headY);g.closePath();g.fill();
    if(!female){for(const dx of [-.18,-.06,.07,.18]){g.beginPath();g.moveTo(x+s*dx,headY-s*.19);g.lineTo(x+s*(dx+.05),headY-s*.31);g.lineTo(x+s*(dx+.1),headY-s*.18);g.fill()}}
    // headband/ribbon
    g.strokeStyle=accent;g.lineWidth=s*.045;g.beginPath();g.arc(x,headY-s*.03,headR*.98,Math.PI*1.08,Math.PI*1.92);g.stroke();
    // eyes and mouth
    const lookX=(p.dirX||0)*s*.018,lookY=(p.dirY||0)*s*.008;g.fillStyle='#14213d';g.beginPath();g.arc(x-s*.085+lookX,headY+s*.02+lookY,s*.025,0,Math.PI*2);g.arc(x+s*.085+lookX,headY+s*.02+lookY,s*.025,0,Math.PI*2);g.fill();g.strokeStyle='#b76e79';g.lineWidth=Math.max(1,s*.012);g.beginPath();g.arc(x,headY+s*.09,s*.04,.1,Math.PI-.1);g.stroke();
    if(!preview&&p.name){g.fillStyle='#fff';g.font=`700 ${Math.max(11,s*.28)}px system-ui`;g.textAlign='center';g.shadowColor='#000';g.shadowBlur=4;g.fillText(p.name,x,y-s*.72)}
    g.restore();
  }

  function init(){
    if(typeof controls!=='function'||typeof screens!=='function'||typeof person!=='function'||typeof message!=='function')return;
    controls=function(){const p=me(),canMove=phase==='lobby'||(phase==='playing'&&p&&p.alive),canAction=phase==='lobby'||(phase==='playing'&&p&&p.alive);if(touch){joy.style.display=canMove?'block':'none';jumpBtn.style.display=canAction?'block':'none';shoveBtn.style.display=canAction?'block':'none'}else{joy.style.display='none';jumpBtn.style.display='none';shoveBtn.style.display='none'}};

    person=function(p,x,y,s,side=false){
      if(!side&&phase==='lobby'&&p.jumpUntil&&p.jumpUntil>Date.now()){const remain=Math.max(0,Math.min(600,p.jumpUntil-Date.now())),q=1-remain/600;y-=Math.sin(q*Math.PI)*s*.28}
      drawChibi(ctx,p,x,y,s,side,false);
    };

    const bm=message;
    message=function(m){
      if(m&&m.type==='joined'&&Array.isArray(m.chatHistory)){
        const hidden=m.chatHistory.filter(parseChar),clean=m.chatHistory.filter(x=>!(x&&typeof x.text==='string'&&x.text.startsWith(CHAR_PREFIX)));
        m={...m,chatHistory:clean};bm(m);hidden.forEach(parseChar);applyChar(myId,prefs.sex,prefs.color);setTimeout(sendPrefs,80);ensureCustomizer();return;
      }
      if(parseChar(m))return;
      bm(m);ensureCustomizer();
    };

    const os=screens;screens=function(){os();ensureCustomizer();const b=document.getElementById('charCustomizeBtn');if(b)b.style.display=roomCode&&phase==='lobby'?'block':'none'};
    ensureCustomizer();controls();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();