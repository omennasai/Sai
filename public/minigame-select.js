(()=>{
  let selectedGame='falling_tiles';
  const games={
    falling_tiles:{name:'떨어지는 발판',desc:'12×12 발판 위에서 마지막까지 살아남으세요',ready:true},
    box_contest:{name:'박스 쟁탈전',desc:'60초 동안 박스를 자기 구역으로 옮기고 상대 박스도 훔치세요',ready:false}
  };

  function me(){return typeof players!=='undefined'&&players.get(myId)}
  function ensureUI(){
    const card=document.querySelector('.lobbyCard');
    if(!card||document.getElementById('miniGamePicker'))return;
    const picker=document.createElement('div');
    picker.id='miniGamePicker';
    picker.innerHTML='<div class="mgLabel">미니게임 선택</div><div class="mgChoices"><button type="button" data-game="falling_tiles">떨어지는 발판</button><button type="button" data-game="box_contest">박스 쟁탈전</button></div><div id="mgDesc"></div>';
    const first=card.querySelector('b');
    const small=card.querySelector('small');
    if(first)first.style.display='none';
    if(small)small.style.display='none';
    card.insertBefore(picker,card.firstChild);
    const style=document.createElement('style');
    style.textContent=`
      #miniGamePicker{margin-bottom:8px}.mgLabel{font-size:12px;color:#9faabd;margin-bottom:6px;font-weight:800}
      .mgChoices{display:grid;grid-template-columns:1fr 1fr;gap:6px}.mgChoices button{margin:0;padding:9px 7px;font-size:12px;background:#1a2230;color:#dbe4f2;border:1px solid #ffffff20}
      .mgChoices button.sel{background:#f4f4f4;color:#111;border-color:#fff}.mgChoices button:disabled{opacity:.65;cursor:default}
      #mgDesc{margin-top:7px;min-height:34px;color:#aab2c0;font-size:11px;line-height:1.35}
      @media(max-width:700px) and (orientation:portrait){.lobbyCard{top:96px!important;bottom:auto!important;right:12px!important;width:210px!important}}
    `;
    document.head.appendChild(style);
    picker.querySelectorAll('button[data-game]').forEach(btn=>btn.addEventListener('click',()=>{
      const p=me();
      if(!p||!p.host||phase!=='lobby')return;
      send({type:'select_game',game:btn.dataset.game});
    }));
  }

  function render(){
    ensureUI();
    const picker=document.getElementById('miniGamePicker');
    if(!picker)return;
    const p=me(),isHost=!!(p&&p.host);
    picker.querySelectorAll('button[data-game]').forEach(btn=>{
      btn.classList.toggle('sel',btn.dataset.game===selectedGame);
      btn.disabled=!isHost||phase!=='lobby';
    });
    const g=games[selectedGame]||games.falling_tiles;
    const desc=document.getElementById('mgDesc');
    if(desc)desc.textContent=g.desc+(g.ready?'':' · 현재 제작 중');
    if(typeof startBtn!=='undefined'&&startBtn){
      const enough=typeof active==='function'&&active().length>=2;
      if(isHost){
        startBtn.disabled=!enough||!g.ready;
        startBtn.textContent=!g.ready?'박스 쟁탈전 제작 중':(enough?'게임 시작':'친구 대기 중');
      }
    }
  }

  const originalMessage=message;
  message=function(m){
    if(m&&m.type==='selected_game'){
      selectedGame=m.game||'falling_tiles';
      render();
      return;
    }
    if(m&&m.type==='game_state'&&m.selectedGame)selectedGame=m.selectedGame;
    if(m&&m.type==='joined'&&m.game&&m.game.selectedGame)selectedGame=m.game.selectedGame;
    originalMessage(m);
    render();
  };

  const originalLobbyUI=lobbyUI;
  lobbyUI=function(){originalLobbyUI();render()};
  ensureUI();
  render();
})();