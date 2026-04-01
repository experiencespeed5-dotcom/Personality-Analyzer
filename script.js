/* ═══════════════════════════════════════════
   AI Personality Analyzer — script.js
   ═══════════════════════════════════════════ */

/* ── Shared state ── */
let userData = { name: '', personality: '', strengths: '' };

/* ══════════════════════════════════════
   PAGE 1 → 2  |  Start Analysis
══════════════════════════════════════ */
function startAnalysis() {
  const name        = document.getElementById('name').value.trim();
  const personality = document.getElementById('personality').value;
  const strengths   = document.getElementById('strengths').value.trim();

  /* Validation */
  if (!name)        { shake('name');        return; }
  if (!personality) { shake('personality'); return; }
  if (!strengths)   { shake('strengths');   return; }

  userData = { name, personality, strengths };

  /* Go to page 2 */
  transitionTo('page-1', 'page-2');

  /* Run fake loading then show results */
  runLoadingSequence();
}

/* ══════════════════════════════════════
   Fake Loading Sequence (3 steps)
══════════════════════════════════════ */
function runLoadingSequence() {
  const stepIds  = ['step-1', 'step-2', 'step-3'];
  const labels   = [
    '🧠 Scanning neural patterns',
    '🔍 Cross-referencing behaviour data',
    '✨ Generating deep insights'
  ];
  const delays   = [0, 900, 1900];   /* when each step activates (ms) */
  const doneAt   = [800, 1800, 2700]; /* when each step turns green  */
  const showAt   = 3100;             /* when result card appears     */

  /* Activate steps one by one */
  stepIds.forEach((id, i) => {
    setTimeout(() => {
      /* Deactivate previous */
      if (i > 0) {
        const prev = document.getElementById(stepIds[i - 1]);
        prev.classList.remove('active');
      }
      document.getElementById(id).classList.add('active');
    }, delays[i]);

    /* Mark step as done */
    setTimeout(() => {
      const el = document.getElementById(id);
      el.classList.remove('active');
      el.classList.add('done');
      el.textContent = '✔ ' + labels[i].replace(/^[^\s]+\s/, '');
    }, doneAt[i]);
  });

  /* Reveal results */
  setTimeout(showResult, showAt);
}

/* ══════════════════════════════════════
   Populate & Reveal Results
══════════════════════════════════════ */
function showResult() {
  /* Avatar initial */
  document.getElementById('avatar-initial').textContent =
    userData.name.charAt(0).toUpperCase();

  /* Name & personality type */
  document.getElementById('result-name').textContent        = userData.name;
  document.getElementById('result-personality').textContent = userData.personality;

  /* Build strengths list */
  const list = document.getElementById('strengths-list');
  list.innerHTML = '';

  const items = userData.strengths
    .split(/[\n,]+/)
    .map(s => s.trim())
    .filter(Boolean);

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.animationDelay = `${i * 0.13}s`;
    list.appendChild(li);
  });

  /* Funny fixed strength */
  const funnyLi = document.createElement('li');
  funnyLi.textContent = 'Replies "hmm" after 2 hours 💬';
  funnyLi.style.animationDelay = `${items.length * 0.13}s`;
  list.appendChild(funnyLi);

  /* Swap loading ↔ result */
  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('result-state').classList.remove('hidden');

  /* Animate confidence bar after small delay */
  setTimeout(() => {
    document.querySelector('.confidence-fill').style.width = '94%';
  }, 300);
}

/* ══════════════════════════════════════
   PAGE 2 → 3  |  Show Prank Screen
══════════════════════════════════════ */
function showReport() {
  transitionTo('page-2', 'page-3');
  setTimeout(launchConfetti, 250);
}

/* ══════════════════════════════════════
   Restart — reset everything → page 1
══════════════════════════════════════ */
function restart() {
  /* Clear form */
  document.getElementById('name').value        = '';
  document.getElementById('personality').value = '';
  document.getElementById('strengths').value   = '';

  /* Reset loading steps */
  const labels = [
    '🧠 Scanning neural patterns',
    '🔍 Cross-referencing behaviour data',
    '✨ Generating deep insights'
  ];
  ['step-1', 'step-2', 'step-3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.className = 'step';
    el.textContent = labels[i];
  });
  document.getElementById('step-1').classList.add('active');

  /* Reset confidence bar */
  document.querySelector('.confidence-fill').style.width = '0%';

  /* Reset page-2 panels */
  document.getElementById('loading-state').classList.remove('hidden');
  document.getElementById('result-state').classList.add('hidden');

  /* Clear confetti */
  document.getElementById('confetti').innerHTML = '';

  /* Go back to page 1 */
  transitionTo('page-3', 'page-1');
}

/* ══════════════════════════════════════
   Smooth Page Transition
══════════════════════════════════════ */
function transitionTo(fromId, toId) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);

  from.style.animation = 'cardOut 0.3s cubic-bezier(0.22,1,0.36,1) forwards';

  setTimeout(() => {
    from.classList.add('hidden');
    from.style.animation = '';
    to.classList.remove('hidden');
    to.style.animation = 'cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both';
  }, 290);
}

/* ══════════════════════════════════════
   Input Shake on Validation Error
══════════════════════════════════════ */
function shake(fieldId) {
  const el = document.getElementById(fieldId);
  el.classList.remove('shake-anim');
  void el.offsetWidth; /* force reflow to restart animation */
  el.classList.add('shake-anim');
  el.addEventListener('animationend', () => el.classList.remove('shake-anim'), { once: true });
  el.focus();
}

/* ══════════════════════════════════════
   Confetti Burst (2 waves)
══════════════════════════════════════ */
function launchConfetti() {
  spawnConfetti(65, 0);
  setTimeout(() => spawnConfetti(45, 0), 900);
}

function spawnConfetti(count, baseDelay) {
  const wrap   = document.getElementById('confetti');
  const colors = ['#a78bfa','#f472b6','#34d399','#fbbf24','#60a5fa','#fb923c','#f87171'];

  for (let i = 0; i < count; i++) {
    const piece   = document.createElement('div');
    piece.className = 'confetti-piece';

    const size    = Math.random() * 9 + 5;
    const color   = colors[Math.floor(Math.random() * colors.length)];
    const left    = Math.random() * 100;
    const delay   = baseDelay + Math.random() * 1.4;
    const dur     = Math.random() * 2 + 2.2;
    const isCircle = Math.random() > 0.55;

    piece.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      top: -10px;
      border-radius: ${isCircle ? '50%' : '3px'};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;

    /* Make it visible at animation start */
    piece.addEventListener('animationstart', () => {
      piece.style.opacity = '1';
    }, { once: true });

    wrap.appendChild(piece);
  }
}
