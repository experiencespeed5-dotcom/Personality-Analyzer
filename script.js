/* ═══════════════════════════════════════════
   IGG Personality Analyzer — script.js
   ═══════════════════════════════════════════ */

/* ── State ── */
let userData = { name: '', gender: '', personality: '', strengths: '', weaknesses: [] };
let currentGender = '';            /* 'male' | 'female' | 'other' */
const selectedWeaknesses = new Set();
let otherWeaknessText = '';

/* ══════════════════════════════════════════════
   WEAKNESS DEFINITIONS
══════════════════════════════════════════════ */
const WEAKNESSES = {
  male: [
    { emoji: '😏🧣', label: 'Falls for Mask Girl' },
    { emoji: '💕🎙️', label: 'Cute Voice Girl'    },
    { emoji: '🎓👩', label: 'Senior Girl'         },
    { emoji: '😰',   label: 'Afraid to Approach'  },
  ],
  female: [
    { emoji: '💪🏋️', label: 'Fit Boy aka GYM Freak' },
    { emoji: '🌀👦', label: 'Curly Hair Boy'         },
    { emoji: '📚👶', label: 'Junior Boy'              },
    { emoji: '😍',   label: 'Good Looking Boy'        },
  ],
};

/* ══════════════════════════════════════════════
   GENDER SELECTION
══════════════════════════════════════════════ */
function selectGender(gender, el) {
  /* Deselect all gender chips */
  document.querySelectorAll('.gender-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  currentGender = gender;

  /* Show / hide "Other gender" textbox */
  const genderOtherBox = document.getElementById('gender-other-box');
  if (gender === 'other') {
    genderOtherBox.classList.remove('hidden');
    document.getElementById('gender-other-text').focus();
  } else {
    genderOtherBox.classList.add('hidden');
    document.getElementById('gender-other-text').value = '';
  }

  /* Reset weakness state */
  selectedWeaknesses.clear();
  otherWeaknessText = '';
  document.getElementById('weakness-other-box').classList.add('hidden');
  document.getElementById('other-weakness').value = '';

  /* Render weakness chips */
  renderWeaknessChips(gender);
}

/* ── Render weakness chips based on gender ── */
function renderWeaknessChips(gender) {
  const grid = document.getElementById('chips-grid');
  grid.innerHTML = '';

  const list = (gender === 'male' || gender === 'female')
    ? WEAKNESSES[gender]
    : null;

  if (!list) {
    /* "Other" gender → show free-text only */
    const otherChip = makeOtherChip();
    grid.appendChild(otherChip);
    return;
  }

  /* Build 4 chips */
  list.forEach(({ emoji, label }) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = `<span class="chip-emoji">${emoji}</span><span>${label}</span>`;
    chip.onclick = () => toggleChip(chip, label);
    grid.appendChild(chip);
  });

  /* 5th — Other chip */
  grid.appendChild(makeOtherChip());
}

/* ── Build the "Other" chip element ── */
function makeOtherChip() {
  const chip = document.createElement('div');
  chip.className = 'chip chip-other';
  chip.id = 'chip-other-el';
  chip.innerHTML = `<span class="chip-emoji">✏️</span><span>Other</span>`;
  chip.onclick = () => toggleOther(chip);
  return chip;
}

/* ══════════════════════════════════════════════
   CHIP TOGGLE
══════════════════════════════════════════════ */
function toggleChip(el, value) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    selectedWeaknesses.add(value);
  } else {
    selectedWeaknesses.delete(value);
  }
}

function toggleOther(el) {
  el.classList.toggle('selected');
  const box = document.getElementById('weakness-other-box');
  if (el.classList.contains('selected')) {
    box.classList.remove('hidden');
    document.getElementById('other-weakness').focus();
  } else {
    box.classList.add('hidden');
    document.getElementById('other-weakness').value = '';
    otherWeaknessText = '';
    selectedWeaknesses.delete('__other__');
  }
}

function syncOtherChip() {
  otherWeaknessText = document.getElementById('other-weakness').value.trim();
  if (otherWeaknessText) {
    selectedWeaknesses.add('__other__');
  } else {
    selectedWeaknesses.delete('__other__');
  }
}

/* ══════════════════════════════════════════════
   PAGE 1 → 2 | Start Analysis
══════════════════════════════════════════════ */
function startAnalysis() {
  const name        = document.getElementById('name').value.trim();
  const personality = document.getElementById('personality').value;
  const strengths   = document.getElementById('strengths').value.trim();

  /* Validate */
  if (!name)        { shake('name');        return; }
  if (!currentGender) {
    /* Shake the gender grid */
    const gg = document.getElementById('weakness-group').previousElementSibling;
    shakeEl(document.querySelector('.gender-grid'));
    return;
  }
  if (!personality) { shake('personality'); return; }
  if (!strengths)   { shake('strengths');   return; }

  /* Resolve gender label */
  let genderLabel = currentGender.charAt(0).toUpperCase() + currentGender.slice(1);
  if (currentGender === 'other') {
    const customGender = document.getElementById('gender-other-text').value.trim();
    if (customGender) genderLabel = customGender;
  }

  /* Build weaknesses */
  const weaknesses = [];
  selectedWeaknesses.forEach(w => {
    if (w === '__other__') {
      if (otherWeaknessText) weaknesses.push(otherWeaknessText);
    } else {
      weaknesses.push(w);
    }
  });

  userData = { name, gender: genderLabel, personality, strengths, weaknesses };

  transitionTo('page-1', 'page-2');
  runLoadingSequence();
}

/* ══════════════════════════════════════════════
   FAKE LOADING
══════════════════════════════════════════════ */
function runLoadingSequence() {
  const stepIds    = ['step-1', 'step-2', 'step-3'];
  const labels     = [
    '🧠 Scanning neural patterns',
    '🔍 Cross-referencing behaviour data',
    '✨ Generating deep insights',
  ];
  const activateAt = [0, 900, 1900];
  const doneAt     = [800, 1800, 2700];

  stepIds.forEach((id, i) => {
    setTimeout(() => {
      if (i > 0) document.getElementById(stepIds[i-1]).classList.remove('active');
      document.getElementById(id).classList.add('active');
    }, activateAt[i]);

    setTimeout(() => {
      const el = document.getElementById(id);
      el.classList.remove('active');
      el.classList.add('done');
      el.textContent = '✔ ' + labels[i].replace(/^[^\s]+\s/, '');
    }, doneAt[i]);
  });

  setTimeout(showResult, 3100);
}

/* ══════════════════════════════════════════════
   SHOW RESULTS
══════════════════════════════════════════════ */
function showResult() {
  document.getElementById('avatar-initial').textContent = userData.name.charAt(0).toUpperCase();
  document.getElementById('result-name').textContent        = userData.name;
  document.getElementById('result-personality').textContent = userData.personality;

  /* Strengths */
  const sList = document.getElementById('strengths-list');
  sList.innerHTML = '';
  const sItems = userData.strengths.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  sItems.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.animationDelay = `${i * 0.13}s`;
    sList.appendChild(li);
  });
  const funnyLi = document.createElement('li');
  funnyLi.textContent = 'Replies "hmm" after 2 hours 💬';
  funnyLi.style.animationDelay = `${sItems.length * 0.13}s`;
  sList.appendChild(funnyLi);

  /* Weaknesses */
  const wList = document.getElementById('weakness-list');
  wList.innerHTML = '';

  /* Default fallbacks per gender */
  const defaults = {
    male:   ['Falls for mask girl / cute voice 😏', 'Overthinks at 3 AM 🌙', 'Says "I\'m fine" but clearly not 💀'],
    female: ['Goes for gym freak guys 💪', 'Can\'t resist curly hair boys 🌀', 'Totally into good looking guys 😍'],
    other:  ['Falls for anyone with a nice vibe ✨', 'Overthinks texts at 2 AM 💭', 'Smiles and says "I\'m fine" 💀'],
  };

  const genderKey = currentGender in defaults ? currentGender : 'other';
  const toShow = userData.weaknesses.length > 0 ? userData.weaknesses : defaults[genderKey];

  toShow.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.animationDelay = `${i * 0.13}s`;
    wList.appendChild(li);
  });

  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('result-state').classList.remove('hidden');

  setTimeout(() => {
    document.querySelector('.confidence-fill').style.width = '94%';
  }, 300);
}

/* ══════════════════════════════════════════════
   PAGE 2 → 3 | Prank!
══════════════════════════════════════════════ */
function showReport() {
  transitionTo('page-2', 'page-3');
  setTimeout(() => document.getElementById('prank-footer').classList.remove('hidden'), 400);
  setTimeout(() => document.getElementById('popup-overlay').classList.remove('hidden'), 600);
  setTimeout(launchConfetti, 300);
}

/* ══════════════════════════════════════════════
   POPUP CLOSE → scroll to footer
══════════════════════════════════════════════ */
function closePopup() {
  const overlay = document.getElementById('popup-overlay');
  overlay.style.animation = 'fadeOverlayOut 0.3s ease forwards';
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.style.animation = '';
    document.getElementById('prank-footer').scrollIntoView({ behavior:'smooth', block:'center' });
  }, 280);
}

/* ══════════════════════════════════════════════
   RESTART
══════════════════════════════════════════════ */
function restart() {
  document.getElementById('name').value        = '';
  document.getElementById('personality').value = '';
  document.getElementById('strengths').value   = '';
  document.getElementById('gender-other-text').value = '';
  document.getElementById('gender-other-box').classList.add('hidden');
  document.querySelectorAll('.gender-chip').forEach(c => c.classList.remove('selected'));
  currentGender = '';
  selectedWeaknesses.clear();
  otherWeaknessText = '';
  document.getElementById('weakness-other-box').classList.add('hidden');
  document.getElementById('other-weakness').value = '';

  /* Reset chips grid to placeholder */
  document.getElementById('chips-grid').innerHTML =
    '<p class="chips-placeholder">👆 Select your gender first to see options</p>';

  /* Reset loading steps */
  const stepLabels = [
    '🧠 Scanning neural patterns',
    '🔍 Cross-referencing behaviour data',
    '✨ Generating deep insights',
  ];
  ['step-1','step-2','step-3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.className = 'step';
    el.textContent = stepLabels[i];
  });
  document.getElementById('step-1').classList.add('active');

  document.querySelector('.confidence-fill').style.width = '0%';
  document.getElementById('loading-state').classList.remove('hidden');
  document.getElementById('result-state').classList.add('hidden');
  document.getElementById('confetti').innerHTML = '';
  document.getElementById('prank-footer').classList.add('hidden');
  document.getElementById('popup-overlay').classList.add('hidden');

  window.scrollTo({ top:0, behavior:'smooth' });
  transitionTo('page-3', 'page-1');
}

/* ══════════════════════════════════════════════
   TRANSITIONS
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   VALIDATION SHAKE
══════════════════════════════════════════════ */
function shake(fieldId) {
  const el = document.getElementById(fieldId);
  el.classList.remove('shake-anim');
  void el.offsetWidth;
  el.classList.add('shake-anim');
  el.addEventListener('animationend', () => el.classList.remove('shake-anim'), { once:true });
  el.focus();
}
function shakeEl(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'shake 0.42s ease';
  el.style.borderColor = '#f472b6';
  setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 500);
}

/* ══════════════════════════════════════════════
   CONFETTI
══════════════════════════════════════════════ */
function launchConfetti() {
  spawnConfetti(65, 0);
  setTimeout(() => spawnConfetti(45, 0), 900);
}
function spawnConfetti(count, baseDelay) {
  const wrap   = document.getElementById('confetti');
  const colors = ['#a78bfa','#f472b6','#34d399','#fbbf24','#60a5fa','#fb923c','#f87171'];
  for (let i = 0; i < count; i++) {
    const piece    = document.createElement('div');
    piece.className = 'confetti-piece';
    const size     = Math.random() * 9 + 5;
    const color    = colors[Math.floor(Math.random() * colors.length)];
    piece.style.cssText = `
      width:${size}px;height:${size}px;background:${color};
      left:${Math.random()*100}%;top:-10px;
      border-radius:${Math.random()>0.55?'50%':'3px'};
      animation-duration:${Math.random()*2+2.2}s;
      animation-delay:${baseDelay+Math.random()*1.4}s;opacity:0;
    `;
    piece.addEventListener('animationstart', () => { piece.style.opacity='1'; }, { once:true });
    wrap.appendChild(piece);
  }
}
