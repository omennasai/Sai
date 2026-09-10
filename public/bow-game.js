(()=>{
  const G=()=>window.saiSelectedGame||'falling_tiles';
  const arrows=[];
  const motion=new Map();
  let charging=false,chargeAt=0,lastShot=0,bowBtn=null,shotSeq=0,lastMoveSend=0;
  const MAX_CHARGE=1500,SHOT_CD=350;
  const W=1000,H=760;
  const platforms=[
    {x:55,y:650,w:890,h:22},
    {x:110,y:445,w:780,h:20},
    {x:175,y:240,w:650,h:20}
  ];
  const covers=[
    {x:280,y:578,w:72,h:72},{x:650,y:578,w:72,h:72},
    {x:375,y:373,w:70,h:72},{x:555,y:373,w:70,h:72},
    {x:465,y:168,w:70,h:72}
  ];
  function isBow(){return G()==='bow_battle'}
  function ensureMotion(p){if(!motion.has(p.id))motion.set(p.id,{vx:0,vy:0,on:false,lastX:p.x,lastY:p.y});return motion.get(p.id)}
  function worldToScreen(x,y){const pad=24,scale=Math.min((innerWidth-pad*2)/W,(innerHeight-pad*2)/H);return {x:(innerWidth-W*scale)/2+x*scale,y:(innerHeight-H*scale)/2+y*scale,s:scale}}
  function rectScreen(r){const a=worldToScreen(r.x,r.y);return {x:a.x,y:a.y,w:r.w*a.s,h:r.h*a.s}}
  function ensureBowButton(){
    if(bowBtn)return;
    bowBtn=document.createElement('button');bowBtn.id='bowBtn';bowBtn.className='action';bowBtn.textContent='활';bowBtn.style.cssText='right:18px;bottom:92px;display:none;background:#ffd166;color:#16120a;z-index:10';document.body.appendChild(bowBtn);
    const start=e=>{if(!isBow()||phase!=='playing')return;e.preventDefault();if(Date.now()-lastShot<SHOT_CD)return;charging=true;chargeAt=performance.now();};
    const end=e=>{if(!charging)return;e&&e.preventDefault();fire();};
    bowBtn.addEventListener('pointerdown',start);bowBtn.addEventListener('pointerup',end);bowBtn.addEventListener('pointercancel',end);bowBtn.addEventListener('pointerleave',e=>{if(charging&&e.buttons===0)end(e)});
  }
  function fire(){
    if(!charging)return;charging=false;lastShot=Date.now();
    const p=players.get(myId);if(!p)return;
    const charge=Math.max(.08,Math.min(1,(performance.now()-chargeAt)/MAX_CHARGE));
    const dir=(p.dirX||1)>=0?1:-1;
    const speed=8+15*charge,up=2.5+5.5*charge;
    const id=myId+'-'+(++shotSeq)+'-'+Date.now();
    spawnArrow({id,owner:myId,x:p.x+dir*28,y:p.y-48,vx:dir*speed,vy:-up,charge});
    send({type:'bow_shot',id,x:p.x+dir*28,y:p.y-48,vx:dir*speed,vy:-up,charge});
  }
  function spawnArrow(a){if(!a||arrows.some(x=>x.id===a.id))return;arrows.push({...a,life:0,dead:false})}
  function hitCover(a){return covers.some(r=>a.x>=r.x&&a.x<=r.x+r.w&&a.y>=r.y&&a.y<=r.y+r.h)}
  function arrowStep(dt){
    for(const a of arrows){if(a.dead)continue;a.life+=dt;a.vy+=12*dt;a.x+=a.vx*dt*60;a.y+=a.vy*dt*60;
      if(a.life>4||a.x<-50||a.x>W+50||a.y>H+80||hitCover(a)){a.dead=true;continue}
      if(a.owner===myId){for(const p of players.values()){if(p.id===a.owner||p.alive===false)continue;if(Math.hypot(p.x-a.x,(p.y-42)-a.y)<34){a.dead=true;send({type:'bow_hit',target:p.id,arrow:a.id,charge:a.charge,dir:a.vx>=0?1:-1});break}}}
    }
    for(let i=arrows.length-1;i>=0;i--)if(arrows[i].dead)arrows.splice(i,1);
  }
  function standingPlatform(p,m){
    const foot=p.y,prev=m.lastY;
    for(const r of platforms){if(p.x>r.x+10&&p.x<r.x+r.w-10&&m.vy>=0&&prev<=r.y+5&&foot>=r.y-3&&foot<=r.y+18){p.y=r.y;m.vy=0;m.on=true;return true}}
    m.on=false;return false;
  }
  function bowUpdate(now){
    const p=players.get(myId);if(!p||phase!=='playing')return;
    const m=ensureMotion(p),dt=Math.min(.032,(bowUpdate._last?now-bowUpdate._last:16)/1000);bowUpdate._last=now;m.lastY=p.y;m.lastX=p.x;
    let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joyX;if(Math.abs(dx)>.08){dx=Math.max(-1,Math.min(1,dx));p.x+=dx*260*dt;p.dirX=dx>=0?1:-1}
    p.x+=m.vx*dt;m.vx*=Math.pow(.06,dt);
    m.vy+=850*dt;p.y+=m.vy*dt;p.x=Math.max(18,Math.min(W-18,p.x));standingPlatform(p,m);
    if(p.y>H+55){send({type:'bow_out'});p.alive=false}
    arrowStep(dt);
    if(now-lastMoveSend>50){lastMoveSend=now;send({type:'bow_move',x:p.x,y:p.y,dirX:p.dirX||1})}
  }
  function jump(){const p=players.get(myId);if(!p||!isBow()||phase!=='playing')return false;const m=ensureMotion(p);if(m.on){m.vy=-600;m.on=false;send({type:'bow_jump'});return true}return false}
  function drawBow(){
    ctx.fillStyle='#0b1524';ctx.fillRect(0,0,innerWidth,innerHeight);
    const bg=ctx.createLinearGradient(0,0,0,innerHeight);bg.addColorStop(0,'#182b46');bg.addColorStop(1,'#0b0d12');ctx.fillStyle=bg;ctx.fillRect(0,0,innerWidth,innerHeight);
    for(const r of platforms){const q=rectScreen(r);ctx.fillStyle='#596574';ctx.fillRect(q.x,q.y,q.w,q.h);ctx.fillStyle='#778493';ctx.fillRect(q.x,q.y,q.w,4)}
    for(const r of covers){const q=rectScreen(r);ctx.fillStyle='#6e4d31';ctx.fillRect(q.x,q.y,q.w,q.h);ctx.strokeStyle='#a77a4e';ctx.lineWidth=3;ctx.strokeRect(q.x,q.y,q.w,q.h);ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x+q.w,q.y+q.h);ctx.moveTo(q.x+q.w,q.y);ctx.lineTo(q.x,q.y+q.h);ctx.stroke()}
    ctx.fillStyle='#dce8f7';ctx.textAlign='center';ctx.font='700 13px system-ui';const top=worldToScreen(500,40);ctx.fillText('3층 활 전장 · 길게 당길수록 더 멀고 강하게',top.x,top.y);
    for(const a of arrows){const q=worldToScreen(a.x,a.y);ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.atan2(a.vy,a.vx));ctx.strokeStyle=a.owner===myId?'#65a8ff':'#ff6d6d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-11,0);ctx.lineTo(10,0);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(4,-4);ctx.lineTo(4,4);ctx.closePath();ctx.fill();ctx.restore()}
    for(const p of players.values()){if(p.alive===false)continue;const q=worldToScreen(p.x,p.y);person(p,q.x,q.y,q.s*78,false)}
    if(charging&&phase==='playing'){const c=Math.min(1,(performance.now()-chargeAt)/MAX_CHARGE),bw=Math.min(280,innerWidth*.45),x=(innerWidth-bw)/2,y=innerHeight-42;ctx.fillStyle='#000a';ctx.fillRect(x,y,bw,15);ctx.fillStyle=c>=1?'#ffcf56':'#72a8ff';ctx.fillRect(x,y,bw*c,15);ctx.strokeStyle='#fff8';ctx.strokeRect(x,y,bw,15);ctx.fillStyle='#fff';ctx.font='11px system-ui';ctx.fillText('활 차징 '+Math.round(c*100)+'%',innerWidth/2,y-6)}
  }
  function briefingBow(){const b=document.getElementById('briefing');if(!b)return;const title=b.querySelector('.briefTitle'),sub=b.querySelector('.briefSub'),rules=b.querySelector('.rules');if(isBow()){if(title)title.textContent='활전';if(sub)sub.textContent='3층 전장에서 활을 차징해 상대를 밀어내세요.';if(rules)rules.innerHTML='<div class="rule"><b>3층 전장</b>세 개 층과 엄폐물이 있습니다. 아래층으로 떨어질 수 있습니다.</div><div class="rule"><b>활 차징</b>활 버튼/마우스를 누르고 있다가 놓으면 발사합니다. 최대 차징은 1.5초입니다.</div><div class="rule"><b>차징 효과</b>오래 당길수록 화살 속도·사거리·넉백이 강해집니다.</div><div class="rule"><b>승리 조건</b>상대를 맵 아래로 떨어뜨리면 승리합니다.</div>'}}
  function init(){
    ensureBowButton();
    const om=message;message=function(m){
      if(m?.type==='bow_shot'){spawnArrow(m);return}
      if(m?.type==='bow_move'){const p=players.get(m.id);if(p){p.x=m.x;p.y=m.y;p.dirX=m.dirX||p.dirX}return}
      if(m?.type==='bow_knock'){const p=players.get(m.id);if(p){p.x=m.x;p.y=m.y;if(p.id===myId){const mm=ensureMotion(p);mm.vx=(m.dir||1)*(180+280*(m.charge||.2));mm.vy=-120-230*(m.charge||.2)}else{p.x=m.x;p.y=m.y}}return}
      if(m?.type==='bow_out'){const p=players.get(m.id);if(p)p.alive=false;return}
      om(m);briefingBow();
    };
    const or=render;render=function(now){if(isBow()&&(phase==='playing'||phase==='intro')){ctx.clearRect(0,0,innerWidth,innerHeight);drawBow();frames++;if(now-fpsAt>500){fps=Math.round(frames*1000/(now-fpsAt));frames=0;fpsAt=now}net.innerHTML=`PING ${ping??'--'}ms<br>FPS ${fps||'--'}<br>SYNC ${syncDelay??'--'}ms`;requestAnimationFrame(render);return}or(now)};
    const ou=update;update=function(now){if(isBow()&&phase==='playing'){bowUpdate(now);requestAnimationFrame(update);return}ou(now)};
    const oc=controls;controls=function(){oc();ensureBowButton();if(bowBtn)bowBtn.style.display=isBow()&&phase==='playing'&&touch?'block':'none';if(isBow()&&phase==='playing'){shoveBtn.style.display='none'}};
    const os=screens;screens=function(){os();briefingBow();controls()};
    addEventListener('keydown',e=>{if(!isBow()||phase!=='playing'||[chatInput,nameInput,codeInput].includes(document.activeElement))return;if((e.key===' '||e.key.toLowerCase()==='w')&&!e.repeat){if(jump())e.preventDefault()}if(e.key.toLowerCase()==='f'&&!e.repeat&&!charging){charging=true;chargeAt=performance.now()}},true);
    addEventListener('keyup',e=>{if(isBow()&&e.key.toLowerCase()==='f'&&charging)fire()},true);
    canvas.addEventListener('pointerdown',e=>{if(!touch&&isBow()&&phase==='playing'&&e.button===0&&!charging){charging=true;chargeAt=performance.now()}},true);
    addEventListener('pointerup',e=>{if(!touch&&isBow()&&phase==='playing'&&e.button===0&&charging)fire()},true);
    const oj=jumpBtn.onpointerdown;jumpBtn.onpointerdown=e=>{if(isBow()){e.preventDefault();jump();return}oj&&oj.call(jumpBtn,e)};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();