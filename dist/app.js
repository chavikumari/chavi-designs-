(() => {
  'use strict';
  const welcome = document.getElementById('welcome');
  let introTimer;
  if (welcome && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let visited = false;
    try { visited = sessionStorage.getItem('chavi-welcome') === 'seen'; sessionStorage.setItem('chavi-welcome', 'seen'); } catch {}
    if (!visited) {
      welcome.hidden = false;
      welcome.removeAttribute('aria-hidden');
      const dismiss = () => { clearTimeout(introTimer); welcome.classList.add('leaving'); setTimeout(() => { welcome.hidden = true; }, 350); };
      document.getElementById('skip-intro').addEventListener('click', dismiss);
      introTimer = setTimeout(dismiss, 1300);
    }
  }
  const dialog = document.getElementById('play-dialog');
  if (!dialog) return;
  const title = document.getElementById('game-title');
  const body = document.getElementById('game-body');
  let timers = [];
  let activeButton;
  const clean = () => { timers.forEach(clearTimeout); timers = []; };
  const status = message => { const result = body.querySelector('.game-result'); if (result) result.textContent = message; };
  const close = () => { clean(); dialog.close(); if (activeButton) activeButton.focus(); };
  document.getElementById('close-game').addEventListener('click', close);
  dialog.addEventListener('close', clean);
  dialog.addEventListener('click', e => { if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) close(); } });
  document.querySelectorAll('[data-game]').forEach(button => button.addEventListener('click', () => {
    activeButton = button; clean();
    ({memory, colour, doodle})[button.dataset.game]();
    dialog.showModal();
    if (button.dataset.game === 'doodle') setupCanvas();
  }));
  function shuffled(list) { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function memory() {
    clean(); title.textContent = 'A match made in colour.';
    const faces = [{s:'✳',n:'star'},{s:'♥',n:'heart'},{s:'●',n:'circle'},{s:'✿',n:'flower'}];
    const deck = shuffled([...faces, ...faces]);
    let first = null, locked = false, moves = 0, pairs = 0;
    body.innerHTML = '<p class="game-instructions">Find the four matching pairs. No rush — your creative break starts here.</p><div class="memory-board"></div><div class="game-status"><span id="memory-count">0 moves · 0 / 4 pairs</span><button id="restart-memory">Start again ↻</button></div><p class="game-result" role="status" aria-live="polite"></p>';
    const board = body.querySelector('.memory-board');
    deck.forEach((face,i) => {
      const tile = document.createElement('button'); tile.className = 'memory-card'; tile.textContent = '?'; tile.setAttribute('aria-label', `Reveal card ${i+1}`);
      tile.addEventListener('click', () => {
        if (locked || tile.classList.contains('flipped') || tile.classList.contains('matched')) return;
        tile.textContent = face.s; tile.classList.add('flipped'); tile.setAttribute('aria-label', `Card ${i+1}: ${face.n}`);
        if (first === null) { first = {tile,face,index:i}; return; }
        moves++;
        if (first.face.n === face.n) {
          pairs++; first.tile.classList.add('matched'); tile.classList.add('matched'); first.tile.setAttribute('aria-disabled','true'); tile.setAttribute('aria-disabled','true'); first = null;
          status(pairs === 4 ? `All four pairs! A lovely little brain break in ${moves} moves.` : 'A perfect pair. Keep going!');
        } else {
          locked = true; const previous = first;
          timers.push(setTimeout(() => { [previous.tile,tile].forEach((t,k) => { t.textContent = '?'; t.classList.remove('flipped'); t.setAttribute('aria-label',`Reveal card ${k===0?previous.index+1:i+1}`); }); first = null; locked = false; },850));
          status('A little different. Try another pair.');
        }
        body.querySelector('#memory-count').textContent = `${moves} ${moves === 1 ? "move" : "moves"} · ${pairs} / 4 pairs`;
      }); board.append(tile);
    });
    body.querySelector('#restart-memory').addEventListener('click', memory);
  }
  function colour() {
    clean(); title.textContent = 'Spot the odd shade.';
    let round = 1, attempts = 0, locked = false;
    body.innerHTML = '<p class="game-instructions">One swatch is a little lighter. Trust your eye and find it. Five rounds, each a little trickier.</p><div class="shade-board"></div><div class="game-status"><span id="shade-count">Round 1 / 5</span><button id="restart-shade">Start again ↻</button></div><p class="game-result" role="status" aria-live="polite"></p>';
    const board = body.querySelector('.shade-board');
    const draw = () => {
      board.replaceChildren(); locked = false;
      const odd = Math.floor(Math.random()*9), hues=[330,90,27,170,260], differences=[20,16,13,10,8], hue=hues[round-1];
      for (let i=0;i<9;i++) {
        const tile=document.createElement('button'); tile.className='shade-tile'; tile.style.backgroundColor=`hsl(${hue} 62% ${46+(i===odd?differences[round-1]:0)}%)`; tile.setAttribute('aria-label',`Choose swatch ${i+1}`);
        tile.addEventListener('click',()=>{
          if(locked) return; attempts++;
          if(i!==odd){status('Close! Look for the lighter shade.');return;}
          locked=true;
          if(round===5){status(`Five for five! You spotted every shade in ${attempts} guesses.`);board.innerHTML='<div class="victory" style="grid-column:1/-1">You’ve got a<br>great eye. ✳</div>';return;}
          status('You spotted it! Next palette…');
          timers.push(setTimeout(()=>{round++;body.querySelector('#shade-count').textContent=`Round ${round} / 5`;draw();status('');},650));
        }); board.append(tile);
      }
    }; draw();body.querySelector('#restart-shade').addEventListener('click',colour);
  }
  function doodle() {
    clean();title.textContent='No brief. Just doodle.';
    body.innerHTML='<p class="game-instructions">Pick a colour and make a mark. Use your finger or mouse — or focus the canvas and use arrow keys. Space lifts the pen.</p><div class="game-tools"><button class="pen" style="background:#ed008c" data-pen="#ed008c" aria-label="Pink pen" aria-pressed="true"></button><button class="pen" style="background:#2b1724" data-pen="#2b1724" aria-label="Dark pen" aria-pressed="false"></button><button class="pen" style="background:#6c8846" data-pen="#6c8846" aria-label="Green pen" aria-pressed="false"></button><button class="pen" style="background:#e09437" data-pen="#e09437" aria-label="Orange pen" aria-pressed="false"></button><button id="undo-doodle">Undo</button><button id="clear-doodle">Clear</button><button id="save-doodle">Save drawing ↓</button></div><canvas id="doodle-canvas" tabindex="0" aria-label="Drawing canvas. Arrow keys draw. Space toggles the pen. Home returns to centre."></canvas><p class="canvas-note">Just for you. Drawings stay in this playroom until you close it.</p><p class="game-result" role="status" aria-live="polite"></p>';
  }
  function setupCanvas() {
    const canvas=body.querySelector('canvas'); if(!canvas)return;
    const rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.fillStyle='#fff';ctx.fillRect(0,0,rect.width,rect.height);ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';
    let ink='#ed008c',drawing=false,history=[],x=rect.width/2,y=rect.height/2,penDown=true;
    const remember=()=>{history.push(ctx.getImageData(0,0,canvas.width,canvas.height));if(history.length>20)history.shift();};
    const point=e=>{const r=canvas.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
    const line=(ax,ay,bx,by)=>{ctx.strokeStyle=ink;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();};
    canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();remember();drawing=true;[x,y]=point(e);canvas.setPointerCapture(e.pointerId);line(x,y,x+.1,y+.1);});
    canvas.addEventListener('pointermove',e=>{if(!drawing)return;const [nx,ny]=point(e);line(x,y,nx,ny);x=nx;y=ny;});
    ['pointerup','pointercancel','lostpointercapture'].forEach(name=>canvas.addEventListener(name,()=>drawing=false));
    canvas.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();penDown=!penDown;status(penDown?'Pen down. Arrow keys draw.':'Pen lifted. Arrow keys move.');return;}if(e.key==='Home'){e.preventDefault();x=rect.width/2;y=rect.height/2;return;}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();remember();let nx=x,ny=y;if(e.key==='ArrowLeft')nx-=10;if(e.key==='ArrowRight')nx+=10;if(e.key==='ArrowUp')ny-=10;if(e.key==='ArrowDown')ny+=10;nx=Math.max(3,Math.min(rect.width-3,nx));ny=Math.max(3,Math.min(rect.height-3,ny));if(penDown)line(x,y,nx,ny);x=nx;y=ny;});
    body.querySelectorAll('[data-pen]').forEach(p=>p.addEventListener('click',()=>{ink=p.dataset.pen;body.querySelectorAll('[data-pen]').forEach(b=>b.setAttribute('aria-pressed',String(b===p)));}));
    body.querySelector('#undo-doodle').addEventListener('click',()=>{if(history.length){ctx.putImageData(history.pop(),0,0);status('Last mark undone.');}else status('A fresh canvas. Nothing to undo yet.');});
    body.querySelector('#clear-doodle').addEventListener('click',()=>{remember();ctx.fillStyle='#fff';ctx.fillRect(0,0,rect.width,rect.height);status('A fresh start.');});
    body.querySelector('#save-doodle').addEventListener('click',()=>{const a=document.createElement('a');a.download='my-chavi-playroom-doodle.png';a.href=canvas.toDataURL('image/png');a.click();status('Your drawing is ready to keep.');});
  }
})();
