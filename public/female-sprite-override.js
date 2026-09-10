(()=>{
  const femaleImg=new Image();
  femaleImg.src='/female_idle_transparent.webp?v=1';
  function boot(){
    if(typeof person!=='function')return;
    const basePerson=person;
    person=function(p,x,y,s,side=false){
      if(p&&p.charSex==='female'){
        let yy=y;
        if(!side&&typeof phase!=='undefined'&&phase==='lobby'&&p.jumpUntil&&p.jumpUntil>Date.now()){
          const r=Math.max(0,Math.min(600,p.jumpUntil-Date.now())),q=1-r/600;
          yy-=Math.sin(q*Math.PI)*s*.28;
        }
        const w=s*.9,h=s*1.34;
        ctx.save();
        ctx.globalAlpha=p.connected===false?.35:1;
        if(femaleImg.complete&&femaleImg.naturalWidth)ctx.drawImage(femaleImg,x-w/2,yy-h*.74,w,h);
        else return basePerson(p,x,y,s,side);
        if(p.name){ctx.fillStyle='#fff';ctx.font=`800 ${Math.max(11,s*.28)}px system-ui`;ctx.textAlign='center';ctx.shadowColor='#000';ctx.shadowBlur=5;ctx.fillText(p.name,x,yy-h*.8)}
        ctx.restore();
        return;
      }
      return basePerson(p,x,y,s,side);
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();