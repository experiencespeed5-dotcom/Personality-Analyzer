// script.js
/* ═══════════════════════════════════════════
   AI Personality Analyzer — script.js
   ═══════════════════════════════════════════ */

/* ── Shared state ── */
let userData = { name: '', personality: '', strengths: '', weakness: '' };

/* ══════════════════════════════════════
   PAGE 1 → 2  |  Start Analysis
══════════════════════════════ */
function startAnalysis() {
  const name        = document.getElementById('name').value.trim();
  const personality = document.getElementById('personality').value;
  const strengths   = document.getElementById('strengths').value.trim();
  const weaknessEl  = document.querySelector('input[name="weakness"]:checked');

  /* Validation */
  if (!name)        { shake('name');        return; }
  if (!personality) { shake('personality'); return; }
  if (!strengths)   { shake('strengths');   return; }
  if (!weaknessEl)  { alert('Please select a weakness'); return; }

  userData = { name, personality, strengths, weakness: weaknessEl.value };

  /* Go to page 2 */
  transitionTo('page-1', 'page-2');

  /* Run fake loading then show results */
  runLoadingSequence();
}

/* ══════════════════════════════════════
   Fake Loading Sequence (3 steps)
══════════════════════════════ */
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
        if (prev) prev.classList.remove('active');
      }
      const el = document.getElementById(id);
      if (el) el.classList.add('active');
    }, delays[i]);

    /* Mark step as done */
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
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
══════════════════════════════ */
function showResult() {
  /* Avatar initial */
  const avatarEl = document.getElementById('avatar-initial');
  if (avatarEl && userData.name) {
    avatarEl.textContent = userData.name.charAt(0).toUpperCase();
  }

  /* Name & personality type */
  const nameEl = document.getElementById('result-name');
  const persEl = document.getElementById('result-personality');
  if (nameEl) nameEl.textContent = userData.name;
  if (persEl) persEl.textContent = userData.personality;

  /* Build strengths list */
  const list = document.getElementById('strengths-list');
  if (list) {
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
    funnyLi.textContent = 'Hmmmm...Replies after 2 hours of overthinking!!';
    funnyLi.style.animationDelay = `${items.length * 0.13}s`;
    list.appendChild(funnyLi);
  }

  /* Show selected weakness */
  const weaknessList = document.getElementById('weakness-list');
  if (weaknessList) {
    weaknessList.innerHTML = '';
    const weaknessLi = document.createElement('li');
    weaknessLi.textContent = userData.weakness;
    weaknessLi.style.animationDelay = '0s';
    weaknessList.appendChild(weaknessLi);
  }

  /* Swap loading ↔ result */
  const loadingState = document.getElementById('loading-state');
  const resultState  = document.getElementById('result-state');
  if (loadingState) loadingState.classList.add('hidden');
  if (resultState)  resultState.classList.remove('hidden');

  /* Animate confidence bar after small delay */
  setTimeout(() => {
    const fill = document.querySelector('.confidence-fill');
    if (fill) fill.style.width = '94%';
  }, 300);
}

/* ══════════════════════════════════════
   PAGE 2 → 3  |  Show Prank Screen
══════════════════════════════ */
function showReport() {
  transitionTo('page-2', 'page-3');
  setTimeout(launchConfetti, 250);
  // show footer image on page 3
  const footer = document.getElementById('prank-footer');
  if (footer) footer.classList.remove('hidden');
}

/* ══════════════════════════════════════
   Restart — reset everything → page 1
══════════════════════════════ */
function restart() {
  /* Clear form */
  document.getElementById('name').value        = '';
  document.getElementById('personality').value = '';
  document.getElementById('strengths').value   = '';
  document.querySelectorAll('input[name="weakness"]').forEach(el => el.checked = false);

  /* Reset loading steps */
  const labels = [
    '🧠 Scanning neural patterns',
    '🔍 Cross-referencing behaviour data',
    '✨ Generating deep insights'
  ];
  ['step-1', 'step-2', 'step-3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'step';
    el.textContent = labels[i];
  });
  const s1 = document.getElementById('step-1');
  if (s1) s1.classList.add('active');

  /* Reset confidence bar */
  const fill = document.querySelector('.confidence-fill');
  if (fill) fill.style.width = '0%';

  /* Reset page-2 panels */
  const loadingState = document.getElementById('loading-state');
  const resultState  = document.getElementById('result-state');
  if (loadingState) loadingState.classList.remove('hidden');
  if (resultState)  resultState.classList.add('hidden');

  /* Clear confetti */
  const confetti = document.getElementById('confetti');
  if (confetti) confetti.innerHTML = '';

  /* Hide footer */
  const footer = document.getElementById('prank-footer');
  if (footer) footer.classList.add('hidden');

  /* Go back to page 1 */
  transitionTo('page-3', 'page-1');
}

/* ══════════════════════════════════════
   Smooth Page Transition
══════════════════════════════ */
function transitionTo(fromId, toId) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);
  if (!from || !to) return;

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
══════════════════════════════ */
function shake(fieldId) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.classList.remove('shake-anim');
  void el.offsetWidth; /* force reflow to restart animation */
  el.classList.add('shake-anim');
  el.addEventListener('animationend', () => el.classList.remove('shake-anim'), { once: true });
  el.focus();
}

/* ══════════════════════════════════════
   Confetti Burst (2 waves)
══════════════════════════════ */
function launchConfetti() {
  spawnConfetti(65, 0);
  setTimeout(() => spawnConfetti(45, 0), 900);
}

function spawnConfetti(count, baseDelay) {
  const wrap   = document.getElementById('confetti');
  if (!wrap) return;
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
