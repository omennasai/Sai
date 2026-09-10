(()=>{
  function applyLobbyControls(){
    if(typeof controls!=='function'||typeof screens!=='function')return;
    controls=function(){
      const me=players.get(myId);
      const canMove=phase==='lobby'||(phase==='playing'&&me&&me.alive);
      const canAction=phase==='lobby'||(phase==='playing'&&me&&me.alive);
      if(touch){
        joy.style.display=canMove?'block':'none';
        jumpBtn.style.display=canAction?'block':'none';
        shoveBtn.style.display=canAction?'block':'none';
      }else{
        joy.style.display='none';
        jumpBtn.style.display='none';
        shoveBtn.style.display='none';
      }
    };

    const originalPerson=person;
    person=function(p,x,y,s,side=false){
      if(!side&&phase==='lobby'&&p.jumpUntil&&p.jumpUntil>Date.now()){
        const remain=Math.max(0,Math.min(600,p.jumpUntil-Date.now()));
        const progress=1-remain/600;
        y-=Math.sin(progress*Math.PI)*s*.28;
      }
      return originalPerson(p,x,y,s,side);
    };

    controls();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyLobbyControls,{once:true});
  else applyLobbyControls();
})();