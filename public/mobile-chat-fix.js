(()=>{
  const NativeWebSocket=window.WebSocket;
  const seen=new Set();
  function chatEls(){return{box:document.getElementById('chat'),log:document.getElementById('chatLog'),input:document.getElementById('chatInput'),toggle:document.getElementById('chatToggle')}}
  function key(m){return [m.id||'',m.at||'',m.name||'',m.text||''].join('|')}
  function renderChat(m){
    if(!m||m.type!=='chat')return;
    const k=key(m);if(seen.has(k))return;seen.add(k);if(seen.size>120){const first=seen.values().next().value;seen.delete(first)}
    const {log}=chatEls();if(!log)return;
    const line=document.createElement('div');
    line.className='mobileChatLine';
    const name=document.createElement('b');name.textContent=(m.name||'Player')+': ';
    const text=document.createElement('span');text.textContent=m.text||'';
    line.append(name,text);log.appendChild(line);
    while(log.children.length>60)log.firstChild.remove();
    requestAnimationFrame(()=>{log.scrollTop=log.scrollHeight});
  }
  class PatchedWebSocket extends NativeWebSocket{
    constructor(...args){
      super(...args);
      this.addEventListener('message',e=>{try{const m=JSON.parse(e.data);if(m.type==='chat')renderChat(m)}catch{}});
    }
  }
  Object.defineProperties(PatchedWebSocket,{CONNECTING:{value:NativeWebSocket.CONNECTING},OPEN:{value:NativeWebSocket.OPEN},CLOSING:{value:NativeWebSocket.CLOSING},CLOSED:{value:NativeWebSocket.CLOSED}});
  window.WebSocket=PatchedWebSocket;
  function applyMobileFix(){
    if(!('ontouchstart' in window)&&!(navigator.maxTouchPoints>0))return;
    const {box,log,input,toggle}=chatEls();if(!box||!log||!input||!toggle)return;
    box.style.zIndex='40';box.style.left='10px';box.style.right='10px';box.style.top='76px';box.style.bottom='auto';box.style.width='auto';box.style.maxHeight='min(320px,55dvh)';
    log.style.height='150px';log.style.minHeight='120px';log.style.overflowY='auto';log.style.webkitOverflowScrolling='touch';log.style.touchAction='pan-y';log.style.color='#fff';log.style.background='rgba(0,0,0,.18)';log.style.borderRadius='8px';log.style.padding='8px';
    input.style.fontSize='16px';input.style.touchAction='manipulation';
    toggle.style.zIndex='41';
    const style=document.createElement('style');style.textContent='.mobileChatLine{display:block;color:#fff;font-size:14px;line-height:1.45;margin:0 0 7px;white-space:normal;overflow-wrap:anywhere}.mobileChatLine b{color:#9fd0ff}';document.head.appendChild(style);
    if(window.visualViewport){const fit=()=>{const h=window.visualViewport.height;box.style.maxHeight=Math.max(180,Math.min(320,h-100))+'px'};window.visualViewport.addEventListener('resize',fit);fit()}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyMobileFix,{once:true});else applyMobileFix();
})();