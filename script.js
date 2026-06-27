// FitPlan — script.js
const S = { goal:null, activity:null, equip:new Set() };

const ACT = { sedentary:1.2, light:1.375, moderate:1.55, very:1.725 };
const GOAL_LABEL = { lose:'Fat loss', maintain:'Body recomposition', gain:'Muscle gain', athletic:'Athletic performance' };
const GOAL_ADJ = { lose:-500, maintain:0, gain:300, athletic:100 };
const MACROS = { lose:{p:.35,c:.40,f:.25}, maintain:{p:.30,c:.45,f:.25}, gain:{p:.30,c:.50,f:.20}, athletic:{p:.25,c:.55,f:.20} };

// ExerciseDB search terms mapped to our exercises
// These are queried live from https://oss.exercisedb.dev — no API key needed
const EXERCISE_MAP = {
  gain: {
    gym: [
      { search:'barbell squat', sets:'4', reps:'6–8', rest:'90s', machine:'Squat rack', badge:'compound' },
      { search:'barbell bench press', sets:'4', reps:'6–8', rest:'90s', machine:'Flat bench + barbell', badge:'compound' },
      { search:'bent over barbell row', sets:'4', reps:'8–10', rest:'75s', machine:'Barbell', badge:'compound' },
      { search:'romanian deadlift', sets:'3', reps:'8–10', rest:'90s', machine:'Barbell', badge:'compound' },
      { search:'barbell overhead press', sets:'3', reps:'6–8', rest:'90s', machine:'Barbell / Smith machine', badge:'compound' },
      { search:'cable lateral raise', sets:'3', reps:'12–15', rest:'45s', machine:'Cable machine', badge:'isolation' },
      { search:'lat pulldown', sets:'3', reps:'10–12', rest:'60s', machine:'Cable machine', badge:'compound' },
      { search:'leg press', sets:'3', reps:'10–12', rest:'75s', machine:'Leg press machine', badge:'compound' },
      { search:'incline dumbbell press', sets:'3', reps:'8–12', rest:'75s', machine:'Incline bench + dumbbells', badge:'compound' },
    ],
    home: [
      { search:'push-up', sets:'4', reps:'10–15', rest:'60s', machine:'Bodyweight', badge:'bodyweight' },
      { search:'dumbbell bent over row', sets:'4', reps:'10–12', rest:'60s', machine:'Dumbbell + bench', badge:'compound' },
      { search:'dumbbell goblet squat', sets:'4', reps:'12–15', rest:'60s', machine:'Single dumbbell', badge:'compound' },
      { search:'dumbbell shoulder press', sets:'3', reps:'10–12', rest:'60s', machine:'Dumbbells', badge:'compound' },
      { search:'romanian deadlift', sets:'3', reps:'10–12', rest:'75s', machine:'Dumbbells', badge:'compound' },
      { search:'dumbbell curl', sets:'3', reps:'12–15', rest:'45s', machine:'Dumbbells', badge:'isolation' },
      { search:'triceps pushdown', sets:'3', reps:'12–15', rest:'45s', machine:'Resistance band', badge:'isolation' },
    ],
    bw: [
      { search:'push-up', sets:'4', reps:'12–20', rest:'60s', machine:'Bodyweight', badge:'bodyweight' },
      { search:'pull-up', sets:'4', reps:'6–12', rest:'75s', machine:'Pull-up bar', badge:'bodyweight' },
      { search:'bodyweight squat', sets:'4', reps:'15–20', rest:'45s', machine:'Bodyweight', badge:'bodyweight' },
      { search:'pike push up', sets:'3', reps:'10–15', rest:'60s', machine:'Bodyweight', badge:'bodyweight' },
      { search:'glute bridge', sets:'3', reps:'15–20', rest:'45s', machine:'Bodyweight', badge:'bodyweight' },
      { search:'plank', sets:'3', reps:'30–60s hold', rest:'30s', machine:'Bodyweight', badge:'core' },
    ]
  },
  lose: {
    gym: [
      { search:'goblet squat', sets:'3', reps:'15–20', rest:'45s', machine:'Kettlebell / dumbbell', badge:'compound' },
      { search:'cable row', sets:'3', reps:'12–15', rest:'45s', machine:'Cable row machine', badge:'compound' },
      { search:'dumbbell lunge', sets:'3', reps:'12 each side', rest:'45s', machine:'Dumbbells', badge:'compound' },
      { search:'lat pulldown', sets:'3', reps:'12–15', rest:'45s', machine:'Cable machine', badge:'compound' },
      { search:'face pull', sets:'3', reps:'15–20', rest:'30s', machine:'Cable machine', badge:'isolation' },
      { search:'jumping jacks', sets:'3', reps:'40 reps', rest:'30s', machine:'Bodyweight', badge:'cardio' },
      { search:'burpee', sets:'3', reps:'10–12', rest:'60s', machine:'Bodyweight', badge:'cardio' },
    ],
    home: [
      { search:'jumping jacks', sets:'3', reps:'30 reps', rest:'30s', machine:'Bodyweight', badge:'cardio' },
      { search:'burpee', sets:'3', reps:'10–15', rest:'60s', machine:'Bodyweight', badge:'cardio' },
      { search:'mountain climber', sets:'3', reps:'20 each', rest:'45s', machine:'Bodyweight', badge:'cardio' },
      { search:'dumbbell goblet squat', sets:'3', reps:'15', rest:'45s', machine:'Dumbbell', badge:'compound' },
      { search:'jump squat', sets:'3', reps:'15', rest:'45s', machine:'Bodyweight', badge:'plyometric' },
    ],
    bw: [
      { search:'burpee', sets:'4', reps:'10–15', rest:'60s', machine:'Bodyweight', badge:'cardio' },
      { search:'high knees', sets:'3', reps:'30s', rest:'30s', machine:'Bodyweight', badge:'cardio' },
      { search:'jump squat', sets:'3', reps:'15', rest:'45s', machine:'Bodyweight', badge:'plyometric' },
      { search:'mountain climber', sets:'3', reps:'20 each', rest:'30s', machine:'Bodyweight', badge:'cardio' },
      { search:'push-up', sets:'3', reps:'10–15', rest:'45s', machine:'Bodyweight', badge:'bodyweight' },
    ]
  },
  maintain: {
    gym: [
      { search:'barbell squat', sets:'3', reps:'10–12', rest:'75s', machine:'Squat rack', badge:'compound' },
      { search:'pull-up', sets:'3', reps:'8–12', rest:'75s', machine:'Pull-up station', badge:'compound' },
      { search:'dumbbell bench press', sets:'3', reps:'10–12', rest:'60s', machine:'Dumbbells + bench', badge:'compound' },
      { search:'plank', sets:'3', reps:'45s hold', rest:'30s', machine:'Bodyweight', badge:'core' },
      { search:'leg curl', sets:'3', reps:'12–15', rest:'45s', machine:'Leg curl machine', badge:'isolation' },
      { search:'cable fly', sets:'3', reps:'12–15', rest:'45s', machine:'Cable machine', badge:'isolation' },
    ],
    home: [
      { search:'push-up', sets:'3', reps:'10–15', rest:'60s', machine:'Bodyweight', badge:'bodyweight' },
      { search:'bodyweight squat', sets:'3', reps:'15–20', rest:'45s', machine:'Bodyweight', badge:'bodyweight' },
      { search:'dumbbell curl', sets:'3', reps:'12', rest:'45s', machine:'Dumbbells', badge:'isolation' },
      { search:'glute bridge', sets:'3', reps:'15', rest:'45s', machine:'Bodyweight', badge:'bodyweight' },
    ],
    bw: [
      { search:'push-up', sets:'3', reps:'15', rest:'45s', machine:'Bodyweight', badge:'bodyweight' },
      { search:'bodyweight squat', sets:'3', reps:'20', rest:'45s', machine:'Bodyweight', badge:'bodyweight' },
      { search:'plank', sets:'3', reps:'30–60s', rest:'30s', machine:'Bodyweight', badge:'core' },
      { search:'superman', sets:'3', reps:'10×3s hold', rest:'30s', machine:'Bodyweight', badge:'core' },
    ]
  },
  athletic: {
    gym: [
      { search:'barbell clean', sets:'4', reps:'4–6', rest:'120s', machine:'Barbell', badge:'olympic lift' },
      { search:'box jump', sets:'4', reps:'5', rest:'90s', machine:'Plyo box', badge:'plyometric' },
      { search:'front squat', sets:'4', reps:'6–8', rest:'90s', machine:'Squat rack', badge:'compound' },
      { search:'barbell deadlift', sets:'4', reps:'5', rest:'120s', machine:'Barbell', badge:'compound' },
      { search:'pull-up', sets:'3', reps:'6–10', rest:'75s', machine:'Pull-up bar', badge:'compound' },
    ],
    home: [
      { search:'jump squat', sets:'4', reps:'10', rest:'60s', machine:'Bodyweight', badge:'plyometric' },
      { search:'burpee', sets:'4', reps:'10', rest:'60s', machine:'Bodyweight', badge:'conditioning' },
      { search:'broad jump', sets:'4', reps:'5', rest:'75s', machine:'Bodyweight', badge:'plyometric' },
      { search:'dumbbell clean', sets:'3', reps:'6 each', rest:'75s', machine:'Dumbbell', badge:'power' },
    ],
    bw: [
      { search:'broad jump', sets:'4', reps:'5', rest:'75s', machine:'Bodyweight', badge:'plyometric' },
      { search:'burpee', sets:'4', reps:'10', rest:'60s', machine:'Bodyweight', badge:'conditioning' },
      { search:'mountain climber', sets:'4', reps:'20 each', rest:'45s', machine:'Bodyweight', badge:'cardio' },
      { search:'push-up', sets:'3', reps:'12–15', rest:'45s', machine:'Bodyweight', badge:'bodyweight' },
    ]
  }
};

function goTo(n) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('s'+n).classList.add('active');
  document.querySelectorAll('.progress-step').forEach((el,i) => {
    el.classList.remove('active','done');
    if(i<n) el.classList.add('done');
    if(i===n) el.classList.add('active');
  });
  window.scrollTo({top:0,behavior:'smooth'});
}

function pick(key, val, el, gid) {
  S[key] = val;
  document.querySelectorAll('#'+gid+' .opt').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
}

function toggle(key, el) {
  if(S.equip.has(key)) { S.equip.delete(key); el.classList.remove('on'); }
  else { S.equip.add(key); el.classList.add('on'); }
}

function equipKey() {
  if(S.equip.has('equip_gym')) return 'gym';
  if(S.equip.has('equip_home')) return 'home';
  return 'bw';
}

function bmr(age, sex, h, w) {
  return sex==='male' ? 10*w+6.25*h-5*age+5 : 10*w+6.25*h-5*age-161;
}

// Fetch real exercise GIF from ExerciseDB open API (no key needed, browser-only)
async function fetchExerciseGif(searchTerm) {
  try {
    const encoded = encodeURIComponent(searchTerm);
    const res = await fetch(`https://oss.exercisedb.dev/api/v1/exercises/name/${encoded}?limit=3`);
    const json = await res.json();
    if(json.data && json.data.length > 0) {
      // Pick first result with a gif
      for(const ex of json.data) {
        if(ex.gifUrl) return { gif: ex.gifUrl, name: ex.name };
      }
    }
  } catch(e) {}
  return null;
}

function dayToggle(hdr) {
  hdr.classList.toggle('open');
  hdr.nextElementSibling.classList.toggle('open');
}

function shuffle(arr) { return [...arr].sort(()=>Math.random()-.5); }

async function generate() {
  goTo(4);

  const age    = parseInt(document.getElementById('age').value)||30;
  const sex    = document.getElementById('sex').value||'male';
  const height = parseFloat(document.getElementById('height').value)||175;
  const weight = parseFloat(document.getElementById('weight').value)||75;
  const goal   = S.goal||'maintain';
  const act    = S.activity||'moderate';
  const tDays  = parseInt(document.getElementById('tDays').value);
  const exp    = document.getElementById('exp').value;
  const eKey   = equipKey();

  // Calculate nutrition
  const b    = Math.round(bmr(age,sex,height,weight));
  const tdee = Math.round(b * ACT[act]);
  const kcal = Math.round(tdee + GOAL_ADJ[goal]);
  const m    = MACROS[goal];
  const prot = Math.round((kcal*m.p)/4);
  const carb = Math.round((kcal*m.c)/4);
  const fat  = Math.round((kcal*m.f)/9);
  const bmi  = (weight/((height/100)**2)).toFixed(1);

  // Get exercise list for goal + equipment
  const pool = shuffle([...(EXERCISE_MAP[goal]?.[eKey]||EXERCISE_MAP[goal]?.bw||[])]);
  const dayTypes = {
    gain:['Push (Chest, Shoulders, Triceps)','Pull (Back, Biceps)','Legs & Core','Upper Body','Push (variation)','Full Body'],
    lose:['HIIT + Strength A','Cardio Circuit','Strength + Conditioning','Active Recovery','HIIT B','Full Body Burn'],
    maintain:['Full Body A','Cardio + Core','Full Body B','Flexibility & Mobility','Full Body C','Active Recovery'],
    athletic:['Power & Speed','Strength A','Conditioning','Strength B','Sport-specific','Recovery & Mobility']
  };
  const days = (dayTypes[goal]||dayTypes['maintain']).slice(0, tDays);
  const perDay = Math.min(5, Math.ceil(pool.length / tDays) + 1);

  // Fetch GIFs concurrently — real exercise demos from ExerciseDB
  const loader = document.getElementById('loader');
  loader.querySelector('span').textContent = 'Fetching exercise demonstrations...';

  const uniqueExercises = pool.slice(0, Math.min(pool.length, tDays * perDay));
  const gifResults = await Promise.all(
    uniqueExercises.map(ex => fetchExerciseGif(ex.search))
  );

  const tips = {
    lose:'A 500 kcal/day deficit leads to ~0.5 kg/week of fat loss (Hall et al., 2012). Prioritize protein at 1.6–2.2g/kg to preserve muscle during a cut.',
    gain:'A 300 kcal surplus combined with progressive overload maximizes lean mass gain while minimizing fat gain (Helms et al., 2014). Track weekly and adjust.',
    maintain:'Body recomposition works best in novice to intermediate lifters. Progressive overload is the key driver — add weight or reps every 1–2 weeks.',
    athletic:'Periodization improves athletic performance by 5–10% over linear training (Harries et al., 2015). Prioritize sleep and nutrition around sessions.'
  };

  // Build day cards
  let daysHTML = '';
  for(let i=0; i<days.length; i++) {
    const dayExercises = [];
    for(let j=0; j<perDay; j++) {
      const idx = (i * perDay + j) % uniqueExercises.length;
      dayExercises.push({ ...uniqueExercises[idx], gifData: gifResults[idx] });
    }

    const exHTML = dayExercises.map(ex => {
      const gifUrl = ex.gifData?.gif || null;
      const exName = ex.gifData?.name || ex.search;
      const gifBlock = gifUrl
        ? `<div class="ex-gif"><img src="${gifUrl}" alt="${exName} — exercise demonstration" loading="lazy" onerror="this.style.display='none';this.parentElement.querySelector('.gif-err').style.display='flex'"><div class="gif-err"><i class="ti ti-barbell"></i></div></div>`
        : `<div class="ex-gif"><div class="gif-err" style="display:flex"><i class="ti ti-barbell"></i></div></div>`;
      return `
        <div class="ex">
          ${gifBlock}
          <div class="ex-info">
            <div class="ex-name">${exName}</div>
            <div class="ex-meta">${ex.sets} sets &times; ${ex.reps} &nbsp;&middot;&nbsp; Rest ${ex.rest}</div>
            ${ex.machine !== 'Bodyweight' ? `<div class="ex-detail"><i class="ti ti-building" style="font-size:12px"></i>&nbsp;${ex.machine}</div>` : ''}
            <span class="ex-badge">${ex.badge}</span>
          </div>
        </div>`;
    }).join('');

    daysHTML += `
      <div class="day">
        <div class="day-hdr" onclick="dayToggle(this)">
          <div class="day-name"><i class="ti ti-calendar" style="font-size:14px;color:var(--g)"></i>&nbsp;Day ${i+1}</div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="day-tag">${days[i]}</div>
            <i class="ti ti-chevron-down day-chev"></i>
          </div>
        </div>
        <div class="day-body">${exHTML}</div>
      </div>`;
  }

  loader.style.display = 'none';
  const planEl = document.getElementById('plan');
  planEl.style.display = 'block';
  planEl.innerHTML = `
    <div class="hero">
      <h2>Your personalized plan is ready</h2>
      <p>Goal: ${GOAL_LABEL[goal]} &nbsp;&middot;&nbsp; ${tDays} days/week &nbsp;&middot;&nbsp; ${exp}</p>
    </div>

    <div class="sh"><i class="ti ti-calculator"></i> Daily nutrition targets</div>

    <div class="mgrid">
      <div class="mc"><div class="mc-val">${kcal}</div><div class="mc-lbl">kcal / day</div></div>
      <div class="mc"><div class="mc-val">${prot}g</div><div class="mc-lbl">Protein</div></div>
      <div class="mc"><div class="mc-val">${carb}g</div><div class="mc-lbl">Carbs</div></div>
      <div class="mc"><div class="mc-val">${fat}g</div><div class="mc-lbl">Fats</div></div>
    </div>

    <div class="cal-bar">
      <div class="cal-seg" style="width:${Math.round(m.p*100)}%;background:var(--g)"></div>
      <div class="cal-seg" style="width:${Math.round(m.c*100)}%;background:var(--gm)"></div>
      <div class="cal-seg" style="width:${Math.round(m.f*100)}%;background:#9FE1CB"></div>
    </div>
    <div class="legend">
      <span><span class="dot" style="background:var(--g)"></span>Protein ${Math.round(m.p*100)}%</span>
      <span><span class="dot" style="background:var(--gm)"></span>Carbs ${Math.round(m.c*100)}%</span>
      <span><span class="dot" style="background:#9FE1CB"></span>Fats ${Math.round(m.f*100)}%</span>
    </div>

    <div class="mgrid" style="margin-top:1.25rem;">
      <div class="mc"><div class="mc-val">${b}</div><div class="mc-lbl">BMR (kcal)</div></div>
      <div class="mc"><div class="mc-val">${tdee}</div><div class="mc-lbl">TDEE (kcal)</div></div>
      <div class="mc"><div class="mc-val">${bmi}</div><div class="mc-lbl">BMI</div></div>
      <div class="mc"><div class="mc-val">${Math.round(weight*2.205)} lb</div><div class="mc-lbl">Weight (lbs)</div></div>
    </div>

    <div class="tip"><i class="ti ti-bulb"></i><p><strong>Research note:</strong> ${tips[goal]}</p></div>

    <div class="sh"><i class="ti ti-calendar-week"></i> Your ${tDays}-day training plan</div>
    <p style="font-size:13px;color:var(--text2);margin-bottom:1.25rem;">
      Tap any day to expand. Each exercise shows a real demonstration GIF and the equipment needed.
    </p>

    ${daysHTML}

    <hr>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
      <button class="btn-sec" onclick="resetApp()"><i class="ti ti-refresh"></i>&nbsp; Start over</button>
      <div class="api-note">Exercise GIFs from <a href="https://oss.exercisedb.dev" target="_blank" style="color:var(--g)">ExerciseDB open API</a></div>
    </div>
  `;
}

function resetApp() {
  S.goal=null; S.activity=null; S.equip=new Set();
  document.getElementById('plan').style.display='none';
  document.getElementById('loader').style.display='block';
  document.getElementById('loader').querySelector('span').textContent='Fetching real exercise demonstrations';
  document.querySelectorAll('.opt').forEach(c=>c.classList.remove('on'));
  goTo(0);
}
</script>
