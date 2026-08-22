// ─── SUPABASE ──────────────────────────────────────────────────
const { createClient } = supabase;
const sb = createClient(
  'https://pnzydemsmqkzbaqsqrvn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuenlkZW1zbXFremJhcXNxcnZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNzA2MDMsImV4cCI6MjEwMjk0NjYwM30.TMuTz4iPJQODtYJzkcLuNZEIJTKeEVuRhJnv-tF0SCY'
);

// ─── LOAD CSS ─────────────────────────────────────────────────
(function(){
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.href = 'styles.css';
  document.head.appendChild(link);
})();

// ─── STATE ────────────────────────────────────────────────────
let CU = null, UP = null;
let wkLogs=[], foodLogs=[], wtLogs=[], measLogs=[];
let photoWeekOff=0, photoWeeks=[];
let curDayIdx=null, curExName=null, curExSets=3;
let timerIv=null, timerSec=90, timerOn=false;
let selMeal='breakfast', curFood=null, curYT='';
let selGoal='deficit', selAct='moderate', selGender='male';
let pickerDayId=0, progDayCount=0;
let cmpAngle='Front', allProgs=[];
const TODAY = new Date().toISOString().split('T')[0];

// ─── EXERCISES ────────────────────────────────────────────────
const EX=[
  {id:"c1",name:"Machine Chest Press",muscle:"Chest",eq:"Machine",cues:["Seat height: handles at mid-chest","Drive elbows slightly down, not flared 90°","Full extension but don't lock out","Slow 2-sec negative"],yt:null},
  {id:"c2",name:"Incline Machine Chest Press",muscle:"Chest",eq:"Machine",cues:["Set incline 30–45°","Upper chest focus — feel the squeeze at top","Don't let shoulders roll forward","Control the weight down"],yt:null},
  {id:"c3",name:"Flat Machine Press",muscle:"Chest",eq:"Machine",cues:["Chest up, slight arch","Push through chest not shoulders","Pause 1 sec at peak contraction","Return slowly under control"],yt:null},
  {id:"c4",name:"Pec Deck Fly",muscle:"Chest",eq:"Machine",cues:["Elbows slightly bent throughout","Think hugging a barrel","Squeeze hard at the centre","Don't go past shoulder line on way back"],yt:null},
  {id:"c5",name:"Cable Chest Fly (Low to High)",muscle:"Chest",eq:"Cable",cues:["Cables set at lowest position","Arc up and in toward upper chest","Slight forward lean","Feel the stretch at the bottom"],yt:null},
  {id:"c6",name:"Cable Chest Fly (High to Low)",muscle:"Chest",eq:"Cable",cues:["Cables set at highest position","Arc down toward lower chest","Keep soft bend in elbows","Control the negative"],yt:null},
  {id:"c7",name:"Dumbbell Flat Bench Press",muscle:"Chest",eq:"Dumbbell",cues:["Dumbbells touch at top","Lower to chest level","Feet flat on floor","Arch naturally"],yt:null},
  {id:"c8",name:"Dumbbell Incline Press",muscle:"Chest",eq:"Dumbbell",cues:["30–45° incline","Upper chest focus","Don't flare elbows too wide","Full range of motion"],yt:null},
  {id:"c9",name:"Dumbbell Fly",muscle:"Chest",eq:"Dumbbell",cues:["Soft bend in elbows","Wide arc down — feel the stretch","Squeeze at top","Don't go too heavy"],yt:null},
  {id:"c10",name:"Push Up",muscle:"Chest",eq:"Bodyweight",cues:["Hands slightly wider than shoulders","Body straight","Lower chest close to floor","Elbows at 45°"],yt:null},
  {id:"c11",name:"Barbell Bench Press",muscle:"Chest",eq:"Barbell",cues:["Grip just outside shoulder width","Bar touches lower chest","Leg drive into floor","Retract shoulder blades"],yt:null},
  {id:"c12",name:"Dips (Chest Focus)",muscle:"Chest",eq:"Bodyweight",cues:["Lean forward 30°","Elbows flare slightly out","Lower until shoulder stretch","Don't lock out elbows"],yt:null},
  {id:"b1",name:"Lat Pulldown Wide Grip",muscle:"Back",eq:"Cable",cues:["Pull to upper chest","Lead with elbows driving down","Lean back slightly 10–15°","Squeeze lats at bottom"],yt:null},
  {id:"b2",name:"Close Grip Lat Pulldown",muscle:"Back",eq:"Cable",cues:["Neutral grip","Elbows drive straight down","Feel lats stretch at top","Full extension between reps"],yt:null},
  {id:"b3",name:"Seated Cable Row",muscle:"Back",eq:"Cable",cues:["Sit tall","Pull to belly button","Squeeze shoulder blades","Slow controlled return"],yt:null},
  {id:"b4",name:"Cable Row Neutral Grip",muscle:"Back",eq:"Cable",cues:["Keep torso upright","Elbows track close to body","Drive elbows behind you","Full stretch forward"],yt:null},
  {id:"b5",name:"Machine High Row",muscle:"Back",eq:"Machine",cues:["Arms start high — feel lat stretch","Pull elbows down and back","Squeeze at bottom","Control weight on way up"],yt:null},
  {id:"b6",name:"Chest Supported Row Machine",muscle:"Back",eq:"Machine",cues:["Chest firmly against pad","Takes lower back out","Pull to hip level","Feel mid-back squeeze"],yt:null},
  {id:"b7",name:"Straight Arm Pulldown",muscle:"Back",eq:"Cable",cues:["Slight bend in elbows","Hinge at hip — lean forward","Arc arms down to hips","Feel the lat stretch at top"],yt:null},
  {id:"b8",name:"Face Pull (Cable)",muscle:"Back",eq:"Cable",cues:["Cable at face height","Pull to forehead — elbows high","External rotate at end","Great for rear delts"],yt:null},
  {id:"b9",name:"Dumbbell Single Arm Row",muscle:"Back",eq:"Dumbbell",cues:["Brace on bench","Pull elbow to hip","Full stretch at bottom","Don't rotate torso"],yt:null},
  {id:"b10",name:"Barbell Bent Over Row",muscle:"Back",eq:"Barbell",cues:["Hinge to 45° — back flat","Pull to belly button","Squeeze at top","Lower with control"],yt:null},
  {id:"b11",name:"Pull Up",muscle:"Back",eq:"Bodyweight",cues:["Full hang at bottom","Pull chest to bar","Elbows drive down and back","No kipping"],yt:null},
  {id:"b12",name:"Chin Up",muscle:"Back",eq:"Bodyweight",cues:["Underhand grip","Chin clears the bar","Full extension at bottom","Controlled"],yt:null},
  {id:"b13",name:"T-Bar Row",muscle:"Back",eq:"Machine",cues:["Chest on pad if supported","Pull handles to chest","Elbows flare slightly out","Squeeze mid-back"],yt:null},
  {id:"b14",name:"Deadlift",muscle:"Back",eq:"Barbell",cues:["Bar over mid-foot","Hinge — don't squat","Big breath and brace core","Drive floor away"],yt:null},
  {id:"s1",name:"Machine Shoulder Press",muscle:"Shoulders",eq:"Machine",cues:["Handles at shoulder level","Press straight up","Don't fully lock out","Control on the way down"],yt:null},
  {id:"s2",name:"Cable Lateral Raise",muscle:"Shoulders",eq:"Cable",cues:["Cable at lowest","Raise to shoulder height","Slight forward lean","Pause 1 sec at top"],yt:null},
  {id:"s3",name:"Machine Lateral Raise",muscle:"Shoulders",eq:"Machine",cues:["Lead with elbows","Raise to shoulder height only","Slow descent","Don't shrug at top"],yt:null},
  {id:"s4",name:"Rear Delt Machine",muscle:"Shoulders",eq:"Machine",cues:["Chest against pad","Arms start forward","Arc back — feel rear delt","Slow return"],yt:null},
  {id:"s5",name:"Dumbbell Lateral Raise",muscle:"Shoulders",eq:"Dumbbell",cues:["Slight forward lean","Raise to shoulder height","Pinky slightly higher","No swinging"],yt:null},
  {id:"s6",name:"Dumbbell Shoulder Press",muscle:"Shoulders",eq:"Dumbbell",cues:["Dumbbells at ear height","Press straight up","Slow controlled descent","Don't touch at top"],yt:null},
  {id:"s7",name:"Arnold Press",muscle:"Shoulders",eq:"Dumbbell",cues:["Start with palms facing you","Rotate as you press up","Palms face forward at top","Reverse on way down"],yt:null},
  {id:"s8",name:"Barbell Overhead Press",muscle:"Shoulders",eq:"Barbell",cues:["Bar at clavicle level","Press straight up","Squeeze glutes and brace core","Lower to chin level"],yt:null},
  {id:"s9",name:"Shrugs (Dumbbell)",muscle:"Shoulders",eq:"Dumbbell",cues:["Hold at sides","Shrug straight up — no rolling","Hold 1 sec at top","Drop slowly"],yt:null},
  {id:"bi1",name:"Machine Preacher Curls",muscle:"Biceps",eq:"Machine",cues:["Upper arm flat on pad","Full extension at bottom","Squeeze hard at top","Don't swing torso"],yt:null},
  {id:"bi2",name:"Cable Bicep Curl",muscle:"Biceps",eq:"Cable",cues:["Elbows stay at sides","Curl to chin level","Squeeze at top","Slow 3-sec negative"],yt:null},
  {id:"bi3",name:"Incline Bench Cable Curl",muscle:"Biceps",eq:"Cable",cues:["Face away from cable","Arms stretched behind at bottom","Full stretch on long head","Curl up — squeeze hard"],yt:null},
  {id:"bi4",name:"Hammer Curl (Rope Cable)",muscle:"Biceps",eq:"Cable",cues:["Neutral grip on rope","Curl up — thumbs toward shoulder","Hits brachialis","Keep elbows tucked"],yt:null},
  {id:"bi5",name:"Dumbbell Bicep Curl",muscle:"Biceps",eq:"Dumbbell",cues:["Supinate as you curl","Elbows stay at sides","Full extension at bottom","No swinging"],yt:null},
  {id:"bi6",name:"Barbell Curl",muscle:"Biceps",eq:"Barbell",cues:["Shoulder width grip","Elbows fixed at sides","Curl to chin level","Slow descent"],yt:null},
  {id:"bi7",name:"Concentration Curl",muscle:"Biceps",eq:"Dumbbell",cues:["Elbow braced on thigh","Full extension at bottom","Curl to shoulder","Great for peak"],yt:null},
  {id:"t1",name:"Tricep Pushdown",muscle:"Triceps",eq:"Cable",cues:["Elbows stay at sides","Push down to full extension","Squeeze at bottom","Slow return"],yt:null},
  {id:"t2",name:"Overhead Cable Extension",muscle:"Triceps",eq:"Cable",cues:["Cable set high — face away","Arms behind head to start","Extend overhead — full lockout","Hits long head"],yt:null},
  {id:"t3",name:"Cable Kickback",muscle:"Triceps",eq:"Cable",cues:["Hinge forward at hip","Upper arm parallel to floor","Extend arm fully back","Squeeze at full extension"],yt:null},
  {id:"t4",name:"Skull Crusher (EZ Bar)",muscle:"Triceps",eq:"Barbell",cues:["Lower bar to forehead","Elbows stay pointed up","Full extension at top","Use EZ bar for comfort"],yt:null},
  {id:"t5",name:"Dumbbell Overhead Extension",muscle:"Triceps",eq:"Dumbbell",cues:["Both hands on one dumbbell","Lower behind head","Extend fully — squeeze","Elbows stay close to head"],yt:null},
  {id:"t6",name:"Rope Pushdown",muscle:"Triceps",eq:"Cable",cues:["Split rope at bottom","Elbows stay at sides","Flare hands out at bottom","Full extension"],yt:null},
  {id:"q1",name:"Leg Press",muscle:"Quads",eq:"Machine",cues:["Feet shoulder width — mid platform","Don't lock knees at top","Lower until 90°","Slow controlled descent"],yt:null},
  {id:"q2",name:"Hack Squat Machine",muscle:"Quads",eq:"Machine",cues:["Feet shoulder width","Chest up — back on pad","Lower until thighs parallel","Drive through heels"],yt:null},
  {id:"q3",name:"Leg Extension",muscle:"Quads",eq:"Machine",cues:["Knee aligns with pivot","Extend fully — squeeze hard","Hold 1 sec at top","Slow 3-sec negative"],yt:null},
  {id:"q4",name:"Bulgarian Split Squat",muscle:"Quads",eq:"Bodyweight",cues:["Rear foot on bench","Front foot far forward","Lower until rear knee near floor","Drive through front heel"],yt:null},
  {id:"q5",name:"Barbell Back Squat",muscle:"Quads",eq:"Barbell",cues:["Bar on upper traps","Feet shoulder width, toes out","Break at hips and knees together","Drive knees out over toes"],yt:null},
  {id:"q6",name:"Goblet Squat",muscle:"Quads",eq:"Dumbbell",cues:["Hold dumbbell at chest","Feet slightly wider","Squat deep — elbows inside knees","Great for beginners"],yt:null},
  {id:"q7",name:"Walking Lunges",muscle:"Quads",eq:"Bodyweight",cues:["Long stride","Back knee lowers near floor","Torso upright","Alternate legs"],yt:null},
  {id:"h1",name:"Seated Leg Curl",muscle:"Hamstrings",eq:"Machine",cues:["Pad just above ankles","Curl fully — heels to glutes","Squeeze at bottom","Slow 3-sec return"],yt:null},
  {id:"h2",name:"Lying Leg Curl",muscle:"Hamstrings",eq:"Machine",cues:["Hips stay flat on pad","Curl heels toward glutes","Squeeze hard at top","Don't let hips rise"],yt:null},
  {id:"h3",name:"Romanian Deadlift (Dumbbell)",muscle:"Hamstrings",eq:"Dumbbell",cues:["Soft bend in knees","Hinge at hip — feel stretch","Lower until mid-shin","Drive hips forward"],yt:null},
  {id:"h4",name:"Romanian Deadlift (Barbell)",muscle:"Hamstrings",eq:"Barbell",cues:["Bar stays close to legs","Hinge until stretch felt","Back stays flat","Squeeze glutes"],yt:null},
  {id:"g1",name:"Hip Thrust Machine",muscle:"Glutes",eq:"Machine",cues:["Upper back on bench","Drive hips up — squeeze hard","Chin tucked","Hold 1 sec at top"],yt:null},
  {id:"g2",name:"Glute Bridge Machine",muscle:"Glutes",eq:"Machine",cues:["Feet flat — hip width","Drive through heels","Full hip extension","Squeeze and hold"],yt:null},
  {id:"g3",name:"Barbell Hip Thrust",muscle:"Glutes",eq:"Barbell",cues:["Upper back on bench","Bar padded at hip crease","Drive hips to full extension","Chin tucked"],yt:null},
  {id:"g4",name:"Sumo Squat",muscle:"Glutes",eq:"Dumbbell",cues:["Wide stance — toes out","Dumbbell at chest","Squat deep","Glute focused"],yt:null},
  {id:"ca1",name:"Standing Calf Raise Machine",muscle:"Calves",eq:"Machine",cues:["Full range — heel below platform","Rise onto ball of foot","Pause and squeeze at top","Slow descent"],yt:null},
  {id:"ca2",name:"Seated Calf Raise",muscle:"Calves",eq:"Machine",cues:["Knees bent — targets soleus","Pad on lower thigh","Full range of motion","Slow and deliberate"],yt:null},
  {id:"ca3",name:"Leg Press Calf Raise",muscle:"Calves",eq:"Machine",cues:["Feet at bottom of platform","Only toes on platform","Full extension at top","Slow controlled return"],yt:null},
  {id:"ab1",name:"Cable Crunch",muscle:"Abs",eq:"Cable",cues:["Kneel facing cable","Rope behind head","Crunch down — elbows to knees","Round the back"],yt:null},
  {id:"ab2",name:"Hanging Knee Raise",muscle:"Abs",eq:"Bodyweight",cues:["Dead hang to start","Bring knees to chest","Control the swing","No momentum"],yt:null},
  {id:"ab3",name:"Hanging Leg Raise",muscle:"Abs",eq:"Bodyweight",cues:["Legs straight","Raise to parallel or higher","Don't swing","Slow descent"],yt:null},
  {id:"ab4",name:"Plank",muscle:"Abs",eq:"Bodyweight",cues:["Forearms on floor","Body in straight line","Squeeze glutes and abs","Breathe normally"],yt:null},
  {id:"ab5",name:"Ab Wheel Rollout",muscle:"Abs",eq:"Other",cues:["Start kneeling","Roll out slowly — back flat","Go as far as you control","Pull back using abs"],yt:null},
  {id:"ab6",name:"Russian Twist",muscle:"Abs",eq:"Bodyweight",cues:["Lean back 45°","Feet off floor for harder","Rotate side to side","Hold weight for progression"],yt:null},
  {id:"ab7",name:"Bicycle Crunch",muscle:"Abs",eq:"Bodyweight",cues:["Alternate elbow to opposite knee","Don't pull on neck","Full rotation","Slow and deliberate"],yt:null},
  {id:"ab8",name:"Dead Bug",muscle:"Abs",eq:"Bodyweight",cues:["Lower back pressed to floor","Extend opposite arm and leg","Move slowly","Great for core stability"],yt:null},
  {id:"ab9",name:"Pallof Press",muscle:"Abs",eq:"Cable",cues:["Cable at chest height","Stand side-on to cable","Press out and hold","Anti-rotation core"],yt:null},
];

const MUSCLE_COLORS = {Chest:'#e8734a',Back:'#5b9cf6',Shoulders:'#e8734a',Biceps:'#5b9cf6',Triceps:'#e8734a',Quads:'#52c47a',Hamstrings:'#52c47a',Glutes:'#52c47a',Calves:'#52c47a',Abs:'#b57bee'};

// ─── DEFAULT PPL PROGRAM ──────────────────────────────────────
const PPL = {
  name:"JFit PPL (5-Day)",
  days:[
    {name:"Push",label:"Day 1",type:"push",exercises:[
      {name:"Machine Chest Press",sets:4,reps:"8–12"},{name:"Incline Machine Chest Press",sets:3,reps:"10–12"},
      {name:"Pec Deck Fly",sets:3,reps:"12–15"},{name:"Machine Shoulder Press",sets:3,reps:"8–12"},
      {name:"Cable Lateral Raise",sets:3,reps:"12–15"},{name:"Tricep Pushdown",sets:3,reps:"10–12"},
      {name:"Overhead Cable Extension",sets:3,reps:"12–15"},
    ]},
    {name:"Pull",label:"Day 2",type:"pull",exercises:[
      {name:"Lat Pulldown Wide Grip",sets:4,reps:"8–12"},{name:"Seated Cable Row",sets:3,reps:"10–12"},
      {name:"Machine High Row",sets:3,reps:"10–12"},{name:"Straight Arm Pulldown",sets:3,reps:"12–15"},
      {name:"Machine Preacher Curls",sets:3,reps:"10–12"},{name:"Cable Bicep Curl",sets:3,reps:"12–15"},
    ]},
    {name:"Legs",label:"Day 3",type:"legs",exercises:[
      {name:"Leg Press",sets:4,reps:"8–12"},{name:"Hack Squat Machine",sets:3,reps:"10–12"},
      {name:"Leg Extension",sets:3,reps:"12–15"},{name:"Seated Leg Curl",sets:3,reps:"10–12"},
      {name:"Lying Leg Curl",sets:3,reps:"12–15"},{name:"Standing Calf Raise Machine",sets:4,reps:"12–15"},
    ]},
    {name:"Push + Abs",label:"Day 4",type:"push",exercises:[
      {name:"Incline Machine Chest Press",sets:4,reps:"8–12"},{name:"Flat Machine Press",sets:3,reps:"10–12"},
      {name:"Cable Chest Fly (Low to High)",sets:3,reps:"12–15"},{name:"Machine Lateral Raise",sets:3,reps:"12–15"},
      {name:"Rear Delt Machine",sets:3,reps:"12–15"},{name:"Tricep Pushdown",sets:3,reps:"10–12"},
      {name:"Cable Kickback",sets:3,reps:"12–15"},{name:"Cable Crunch",sets:3,reps:"12–15"},
      {name:"Hanging Knee Raise",sets:3,reps:"12–15"},{name:"Plank",sets:3,reps:"30–45s"},
    ]},
    {name:"Pull + Legs",label:"Day 5",type:"pull",exercises:[
      {name:"Close Grip Lat Pulldown",sets:4,reps:"8–12"},{name:"Chest Supported Row Machine",sets:3,reps:"10–12"},
      {name:"Cable Row Neutral Grip",sets:3,reps:"10–12"},{name:"Face Pull (Cable)",sets:3,reps:"12–15"},
      {name:"Incline Bench Cable Curl",sets:3,reps:"10–12"},{name:"Hammer Curl (Rope Cable)",sets:3,reps:"12–15"},
      {name:"Bulgarian Split Squat",sets:3,reps:"10–12"},{name:"Leg Extension",sets:3,reps:"12–15"},
      {name:"Seated Leg Curl",sets:3,reps:"12–15"},{name:"Hip Thrust Machine",sets:3,reps:"10–12"},
      {name:"Seated Calf Raise",sets:3,reps:"12–15"},
    ]},
  ]
};

// ─── HTML SKELETON ────────────────────────────────────────────
document.getElementById('root').innerHTML = `
<!-- AUTH -->
<div class="auth-wrap hidden" id="auth-page">
  <div class="auth-logo-wrap">
    <img src="https://pnzydemsmqkzbaqsqrvn.supabase.co/storage/v1/object/public/app-assets/logo.png" class="auth-logo-img" alt="JFit logo">
    <div class="auth-logo-name">J<span>Fit</span></div>
    <div style="font-size:13px;color:rgba(255,255,255,0.45);margin-top:4px;position:relative">Your fitness journey starts here</div>
  </div>
  <div class="auth-card">
    <div class="auth-tabs">
      <div class="auth-tab active" onclick="authTab('login')">Log In</div>
      <div class="auth-tab" onclick="authTab('signup')">Sign Up</div>
    </div>
    <div class="auth-form" id="login-form">
      <div><div class="lbl">Email</div><input class="inp" type="email" id="l-email" placeholder="your@email.com" autocomplete="email"></div>
      <div><div class="lbl">Password</div><input class="inp" type="password" id="l-pass" placeholder="••••••••" autocomplete="current-password"></div>
      <div class="auth-err" id="l-err"></div>
      <button class="btn-accent" onclick="doLogin()">Log In</button>
      <div class="auth-divider">or</div>
      <button class="google-btn" onclick="doGoogle()">${googleSVG()} Continue with Google</button>
    </div>
    <div class="auth-form hidden" id="signup-form">
      <div><div class="lbl">Full Name</div><input class="inp" type="text" id="s-name" placeholder="Your name" autocomplete="name"></div>
      <div><div class="lbl">Email</div><input class="inp" type="email" id="s-email" placeholder="your@email.com" autocomplete="email"></div>
      <div><div class="lbl">Password</div><input class="inp" type="password" id="s-pass" placeholder="Min 6 characters" autocomplete="new-password"></div>
      <div class="auth-err" id="s-err"></div>
      <button class="btn-accent" onclick="doSignup()">Create Account</button>
      <div class="auth-divider">or</div>
      <button class="google-btn" onclick="doGoogle()">${googleSVG()} Continue with Google</button>
    </div>
  </div>
</div>

<!-- SETUP -->
<div class="setup-wrap" id="setup-page">
  <h2 style="font-size:24px;font-weight:700;margin-bottom:6px">Set Up Your Goals</h2>
  <p style="color:var(--text2);font-size:14px;margin-bottom:28px">Help JFit personalise your experience</p>
  <div class="setup-sec">
    <div class="setup-sec-t">Your Stats</div>
    <div class="goal-btns" style="margin-bottom:8px">
      <div class="g-btn active" id="g-male" onclick="setGender('male',this)">👨 Male</div>
      <div class="g-btn" id="g-female" onclick="setGender('female',this)">👩 Female</div>
    </div>
    <div class="setup-row">
      <input class="setup-inp" type="number" id="su-age" placeholder="Age" inputmode="numeric">
      <input class="setup-inp" type="number" id="su-ht" placeholder="Height (cm)" inputmode="decimal">
    </div>
    <div class="setup-row">
      <input class="setup-inp" type="number" id="su-cw" placeholder="Current weight (kg)" inputmode="decimal">
      <input class="setup-inp" type="number" id="su-tw" placeholder="Target weight (kg)" inputmode="decimal">
    </div>
    <input class="setup-inp" type="date" id="su-td">
  </div>
  <div class="setup-sec">
    <div class="setup-sec-t">Your Goal</div>
    <div class="goal-btns" style="flex-wrap:wrap">
      <div class="g-btn active" id="g-deficit" onclick="setGoal('deficit',this)">🔥 Lose Fat</div>
      <div class="g-btn" id="g-surplus" onclick="setGoal('surplus',this)">💪 Build Muscle</div>
      <div class="g-btn" id="g-recomp" onclick="setGoal('recomp',this)">⚡ Lose Fat & Build Muscle</div>
      <div class="g-btn" id="g-maintain" onclick="setGoal('maintain',this)">⚖️ Maintain</div>
    </div>
  </div>
  <div class="setup-sec" style="margin-top:16px">
    <div class="setup-sec-t">Activity Level</div>
    <div class="act-btns">
      <div class="a-btn" id="a-sedentary" onclick="setAct('sedentary',this)">🪑 Sedentary — little or no exercise</div>
      <div class="a-btn" id="a-light" onclick="setAct('light',this)">🚶 Lightly Active — 1–2 days/week</div>
      <div class="a-btn active" id="a-moderate" onclick="setAct('moderate',this)">🏃 Moderately Active — 3–5 days/week</div>
      <div class="a-btn" id="a-very" onclick="setAct('very',this)">⚡ Very Active — 6–7 days/week</div>
    </div>
  </div>
  <div class="calc-box" id="calc-box">
    <div class="calc-row"><span>Daily Calories</span><span class="calc-v" id="cc">—</span></div>
    <div class="calc-row"><span>Protein</span><span class="calc-v" id="cp">—</span></div>
    <div class="calc-row"><span>Carbs</span><span class="calc-v" id="ccb">—</span></div>
    <div class="calc-row"><span>Fat</span><span class="calc-v" id="cf">—</span></div>
  </div>
  <button class="btn-accent" onclick="calcAndSave()">Calculate & Save</button>
</div>

<!-- MAIN APP -->
<div id="main-app" class="hidden">
<div class="page-scroll">

<!-- DASHBOARD -->
<div class="page active" id="page-dashboard"><div class="page-bg bg-dashboard" aria-hidden="true"></div>
  <div class="ph ph-with-bg">
    <div class="ph-row">
      <div><h1 id="d-greet" style="font-size:24px;font-weight:700;color:white">Good morning 👋</h1><p id="d-date" style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:3px"></p></div>
      <div class="avatar" id="av-btn" onclick="toggleMenu()">J</div>
    </div>
  </div>
  <div class="goal-card" id="goal-card">
    <div style="font-size:11px;color:var(--text2);font-weight:700;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:6px">Goal Progress</div>
    <div style="display:flex;align-items:baseline;gap:8px">
      <div style="font-size:28px;font-weight:700" id="d-cw">— kg</div>
      <div style="color:var(--text2)">→</div>
      <div style="font-size:20px;font-weight:600;color:var(--accent)" id="d-tw">— kg</div>
    </div>
    <div class="prog-wrap" style="margin-top:10px"><div class="prog-fill" id="d-prog" style="width:0%"></div></div>
    <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:12px;color:var(--text2)">
      <span id="d-pct">0% achieved</span><span id="d-wks">— weeks left</span>
    </div>
  </div>
  <div class="sec">
    <div class="sec-lbl">Today's Nutrition</div>
    <div class="gc" style="padding:16px">
      <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:2px">
        <div style="font-size:40px;font-weight:800;letter-spacing:-2px" id="d-cal">0</div>
        <div style="font-size:14px;color:var(--text2)">/ <span id="d-cal-t">—</span> kcal</div>
      </div>
      <div class="macro-bars">
        <div class="mb-row"><div class="mb-lbl">Protein</div><div class="mb-track"><div class="mb-fill" id="d-pb" style="width:0%;background:var(--blue)"></div></div><div class="mb-val" id="d-pv">0 / —g</div></div>
        <div class="mb-row"><div class="mb-lbl">Carbs</div><div class="mb-track"><div class="mb-fill" id="d-cb" style="width:0%;background:var(--green)"></div></div><div class="mb-val" id="d-cv">0 / —g</div></div>
        <div class="mb-row"><div class="mb-lbl">Fat</div><div class="mb-track"><div class="mb-fill" id="d-fb" style="width:0%;background:var(--purple)"></div></div><div class="mb-val" id="d-fv">0 / —g</div></div>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-lbl">Stats</div>
    <div class="stat-grid">
      <div class="gc stat-card"><div class="stat-v" id="d-streak">0</div><div class="stat-l">Day Streak 🔥</div></div>
      <div class="gc stat-card"><div class="stat-v" id="d-sess">0</div><div class="stat-l">Sessions</div></div>
      <div class="gc stat-card"><div class="stat-v" id="d-bmi">—</div><div class="stat-l">BMI</div><div class="stat-s" id="d-bmi-l">—</div></div>
      <div class="gc stat-card"><div class="stat-v" id="d-vol">0</div><div class="stat-l">Volume (kg)</div></div>
    </div>
  </div>
</div>

<!-- WORKOUT -->
<div class="page" id="page-workout"><div class="page-bg bg-workout" aria-hidden="true"></div>
  <div class="ph ph-with-bg" style="padding-bottom:20px"><h1 style="color:white;font-size:24px;font-weight:700">Workout</h1><p id="wk-date" style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:3px"></p></div>
  <div id="wk-list"></div>
</div>

<!-- NUTRITION -->
<div class="page" id="page-nutrition"><div class="page-bg bg-nutrition" aria-hidden="true"></div>
  <div class="ph ph-with-bg" style="padding-bottom:20px"><h1 style="color:white;font-size:24px;font-weight:700">Nutrition</h1><p id="nut-date" style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:3px"></p></div>
  <div class="sec">
    <div class="gc" style="padding:16px">
      <div style="display:flex;align-items:baseline;gap:6px">
        <div style="font-size:40px;font-weight:800;letter-spacing:-2px" id="n-cal">0</div>
        <div style="font-size:14px;color:var(--text2)">/ <span id="n-cal-t">—</span> kcal</div>
      </div>
      <div style="font-size:13px;color:var(--text2);margin-top:2px" id="n-left">— kcal remaining</div>
      <div class="macro-bars" style="margin-top:14px">
        <div class="mb-row"><div class="mb-lbl">Protein</div><div class="mb-track"><div class="mb-fill" id="n-pb" style="width:0%;background:var(--blue)"></div></div><div class="mb-val" id="n-pv">0 / —g</div></div>
        <div class="mb-row"><div class="mb-lbl">Carbs</div><div class="mb-track"><div class="mb-fill" id="n-cb" style="width:0%;background:var(--green)"></div></div><div class="mb-val" id="n-cv">0 / —g</div></div>
        <div class="mb-row"><div class="mb-lbl">Fat</div><div class="mb-track"><div class="mb-fill" id="n-fb" style="width:0%;background:var(--purple)"></div></div><div class="mb-val" id="n-fv">0 / —g</div></div>
      </div>
    </div>
  </div>
  <div id="meal-secs"></div>
  <div style="height:16px"></div>
</div>

<!-- PHOTOS -->
<div class="page" id="page-photos">
  <div class="ph"><h1>Progress Photos</h1><p>Log weekly — compare your journey</p></div>
  <div class="gc wk-sel" style="margin:0 16px 16px">
    <button class="wk-nav" onclick="chgPhotoWk(-1)">‹</button>
    <div style="font-size:15px;font-weight:600" id="ph-wk-lbl">This week</div>
    <button class="wk-nav" onclick="chgPhotoWk(1)">›</button>
  </div>
  <div class="angles-grid" id="angles-grid"></div>
  <button class="gc cmp-btn" onclick="openCompare()">⟺ Compare Two Weeks</button>
</div>

<!-- BODY -->
<div class="page" id="page-body"><div class="page-bg bg-body" aria-hidden="true"></div>
  <div class="ph ph-with-bg" style="padding-bottom:20px"><h1 style="color:white;font-size:24px;font-weight:700">Body Stats</h1><p style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:3px">Weight & measurements</p></div>
  <div class="sec">
    <div class="sec-lbl">Weight Log</div>
    <div class="gc" style="padding:16px;margin-bottom:10px">
      <div class="wt-row">
        <input class="wt-inp" type="number" inputmode="decimal" id="wt-inp" placeholder="79.0">
        <div style="font-size:14px;color:var(--text2);padding:0 4px">kg</div>
        <button class="log-btn" onclick="logWeight()">Log</button>
      </div>
    </div>
    <div class="gc" style="padding:16px;margin-bottom:10px">
      <div class="sec-lbl" style="margin-bottom:12px">Last 8 weeks</div>
      <svg id="wt-chart" style="width:100%;overflow:visible" height="80"></svg>
    </div>
    <div class="gc"><div id="wt-hist"></div></div>
  </div>
  <div class="sec">
    <div class="sec-lbl">BMI</div>
    <div class="gc bmi-card">
      <div class="bmi-v" id="bmi-v">—</div>
      <div id="bmi-l" style="font-size:14px;font-weight:600;color:var(--text2);margin-top:4px">Log weight to calculate</div>
      <div class="bmi-scale" style="margin-top:12px">
        <div class="bmi-seg bmi-u" style="flex:1.5"></div>
        <div class="bmi-seg bmi-n" style="flex:2.5"></div>
        <div class="bmi-seg bmi-ow" style="flex:2"></div>
        <div class="bmi-seg bmi-ob" style="flex:4"></div>
      </div>
    </div>
  </div>
  <div class="sec">
    <div class="sec-lbl">Measurements (cm)</div>
    <div class="gc meas-form">
      <div class="mr"><label>Chest</label><input type="number" inputmode="decimal" id="m-chest" placeholder="—"><span>cm</span></div>
      <div class="mr"><label>Waist</label><input type="number" inputmode="decimal" id="m-waist" placeholder="—"><span>cm</span></div>
      <div class="mr"><label>Hips</label><input type="number" inputmode="decimal" id="m-hips" placeholder="—"><span>cm</span></div>
      <div class="mr"><label>Left Arm</label><input type="number" inputmode="decimal" id="m-larm" placeholder="—"><span>cm</span></div>
      <div class="mr"><label>Right Arm</label><input type="number" inputmode="decimal" id="m-rarm" placeholder="—"><span>cm</span></div>
      <div class="mr"><label>Thigh</label><input type="number" inputmode="decimal" id="m-thigh" placeholder="—"><span>cm</span></div>
      <button class="btn-accent" onclick="logMeas()">Save Measurements</button>
    </div>
    <div class="gc" style="margin-top:10px"><div id="meas-hist"></div></div>
  </div>
</div>

<!-- PROGRAMS -->
<div class="page" id="page-programs">
  <div class="ph" style="padding-top:calc(var(--safe-t) + 20px)"><h1 style="font-size:24px;font-weight:700">Programs</h1><p style="color:var(--text2);font-size:13px;margin-top:3px">Switch or create your plan</p></div>
  <div class="prog-list" id="prog-list"></div>
  <button class="gc create-prog-btn" onclick="openCreateProg()">+ Create Custom Program</button>
</div>

</div><!-- page-scroll -->

<!-- BOTTOM NAV -->
<nav class="bottom-nav">
  <button class="nav-btn active" onclick="goPage('dashboard',this)" id="nav-dashboard">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
    Dashboard
  </button>
  <button class="nav-btn" onclick="goPage('workout',this)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6.5 6.5h11M6.5 17.5h11M4 12h16"/><circle cx="4" cy="12" r="1.8" fill="currentColor" stroke="none"/><circle cx="20" cy="12" r="1.8" fill="currentColor" stroke="none"/></svg>
    Workout
  </button>
  <button class="nav-btn" onclick="goPage('nutrition',this)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
    Nutrition
  </button>
  <button class="nav-btn" onclick="goPage('photos',this)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M8.5 5V3.5h7V5"/></svg>
    Photos
  </button>
  <button class="nav-btn" onclick="goPage('body',this)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="5" r="2"/><path d="M12 7v6m0 0-3 4m3-4 3 4"/><path d="M9 10h6"/></svg>
    Body
  </button>
</nav>
</div><!-- main-app -->

<!-- MODALS -->
<div class="modal-ov" id="log-modal">
  <div class="modal-box">
    <div class="modal-handle"></div>
    <div class="modal-h"><h2 id="lm-name"></h2><p id="lm-meta"></p><div class="modal-prev" id="lm-prev"></div></div>
    <div class="modal-body">
      <div class="sets-hdr"><span>Set</span><span>kg</span><span>Reps</span><span>Done</span></div>
      <div id="sets-cont"></div>
      <button class="add-set-btn" onclick="addSet()">+ Add set</button>
      <div class="timer-bar">
        <div class="timer-d" id="td">1:30</div>
        <button class="timer-btn t-start" id="t-btn" onclick="togTimer()">Start</button>
        <button class="timer-btn t-reset" onclick="rstTimer()">Reset</button>
      </div>
      <button class="btn-accent" style="margin-top:16px" onclick="saveLog()">Save Session</button>
    </div>
  </div>
</div>

<div class="modal-ov" id="tut-modal">
  <div class="tut-box">
    <div class="modal-handle"></div>
    <div class="modal-h"><h2 id="tut-nm"></h2><div id="tut-muscle" style="font-size:13px;margin-top:4px"></div></div>
    <div class="modal-body">
      <div id="tut-cues" style="margin-bottom:20px"></div>
      <button class="yt-btn" onclick="openYT()">
        <svg width="20" height="14" viewBox="0 0 20 14"><path fill="#fff" d="M19.58 2.19a2.5 2.5 0 0 0-1.76-1.77C16.25 0 10 0 10 0S3.75 0 2.18.42A2.5 2.5 0 0 0 .42 2.19 26.2 26.2 0 0 0 0 7a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C3.75 14 10 14 10 14s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 20 7a26.2 26.2 0 0 0-.42-4.81z"/><polygon fill="#ff0000" points="0,0 0,14 20,7"/><polygon fill="white" points="8,4 8,10 14,7"/></svg>
        Watch Tutorial on YouTube
      </button>
    </div>
  </div>
</div>

<div class="modal-ov" id="food-modal">
  <div class="fs-box">
    <div class="modal-handle"></div>
    <div class="fs-hdr">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <h2 style="font-size:17px;font-weight:700">Add Food</h2>
        <div style="font-size:12px;color:var(--accent);font-weight:600" id="food-modal-meal-label"></div>
      </div>
      <!-- AI Input -->
      <div style="background:var(--accent-bg);border:1px solid var(--accent-border);border-radius:var(--radius-sm);padding:12px;margin-bottom:10px">
        <div style="font-size:11px;font-weight:700;color:var(--accent);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px">✨ AI Food Parser</div>
        <textarea id="ai-food-input" placeholder="Type what you ate e.g. 200g grilled chicken, cup of rice, glass of oat milk" style="width:100%;background:rgba(255,255,255,0.07);border:1px solid var(--accent-border);border-radius:var(--radius-xs);padding:10px;color:var(--text);font-size:14px;outline:none;resize:none;height:70px;font-family:inherit"></textarea>
        <button id="ai-parse-btn" onclick="parseWithAI(q('ai-food-input').value, selMeal)" style="width:100%;margin-top:8px;padding:10px;background:var(--accent);border:none;border-radius:var(--radius-xs);color:white;font-size:14px;font-weight:700;cursor:pointer">Analyse with AI</button>
      </div>
      <div id="ai-results" style="margin-bottom:10px"></div>
      <!-- Manual Search -->
      <div style="font-size:11px;font-weight:700;color:var(--text2);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px">Or search manually</div>
      <div class="fs-row">
        <input class="fs-inp" type="text" id="fs-inp" placeholder="Search food database..." oninput="srchFood(this.value)">
        <div class="scan-btn" onclick="toast('Use phone camera for barcode scan')">📷</div>
      </div>
    </div>
    <div class="food-results" id="food-res"><div class="food-loading">Search for food above</div></div>
  </div>
</div>

<div class="modal-ov" id="fd-modal">
  <div class="fd-box">
    <div class="modal-handle"></div>
    <div class="fd-body">
      <div style="font-size:18px;font-weight:700;margin-bottom:4px" id="fd-nm"></div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:14px" id="fd-br"></div>
      <div class="mc-chips">
        <div class="mc-chip">🔥 <span id="fd-c">—</span> kcal</div>
        <div class="mc-chip">💪 <span id="fd-p">—</span>g protein</div>
        <div class="mc-chip">🌾 <span id="fd-cb">—</span>g carbs</div>
        <div class="mc-chip">🫙 <span id="fd-f">—</span>g fat</div>
      </div>
      <div class="qty-row">
        <div style="font-size:14px;color:var(--text2)">Quantity:</div>
        <input class="qty-inp" type="number" id="fd-qty" value="100" inputmode="decimal" oninput="updFood()">
        <div style="font-size:14px;color:var(--text2)">g</div>
      </div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:10px">Meal:</div>
      <div class="meal-type-row" id="mt-row">
        <div class="mt-btn active" onclick="selMealType('breakfast',this)">Breakfast</div>
        <div class="mt-btn" onclick="selMealType('lunch',this)">Lunch</div>
        <div class="mt-btn" onclick="selMealType('dinner',this)">Dinner</div>
        <div class="mt-btn" onclick="selMealType('snack',this)">Snack</div>
      </div>
      <button class="btn-accent" onclick="addFood()">Add to Log</button>
    </div>
  </div>
</div>

<div class="modal-ov" id="cmp-modal">
  <div class="cmp-box">
    <div class="cmp-hdr"><h2 style="font-size:16px;font-weight:700;color:#fff">Compare Progress</h2><button class="close-btn" onclick="closeM('cmp-modal')">✕</button></div>
    <div class="cmp-sels">
      <select class="cmp-sel" id="cmp-a" onchange="loadCmp()"><option value="">Week A</option></select>
      <select class="cmp-sel" id="cmp-b" onchange="loadCmp()"><option value="">Week B</option></select>
    </div>
    <div class="ang-tabs" id="ang-tabs">
      <div class="ang-tab active" onclick="setCmpAngle('Front',this)">Front</div>
      <div class="ang-tab" onclick="setCmpAngle('Back',this)">Back</div>
      <div class="ang-tab" onclick="setCmpAngle('Left',this)">Left</div>
      <div class="ang-tab" onclick="setCmpAngle('Right',this)">Right</div>
    </div>
    <div class="slider-wrap" id="sl-wrap"><div class="no-photos">Select two weeks to compare</div></div>
  </div>
</div>

<!-- PROFILE MENU -->
<div class="prof-menu" id="prof-menu">
  <div class="pm-item" onclick="openSetup()">⚙️ Update Goals</div>
  <div class="pm-item" onclick="goToPrograms()">📋 Programs</div>
  <div class="pm-item danger" onclick="doSignout()">🚪 Sign Out</div>
</div>

<!-- CREATE PROGRAM -->
<div class="full-modal" id="create-prog">
  <div class="fm-hdr">
    <button class="back-btn" onclick="closeFullM('create-prog')">‹</button>
    <div style="font-size:20px;font-weight:700">Create Program</div>
  </div>
  <div style="margin-bottom:16px"><div class="lbl">Program Name</div><input class="inp" type="text" id="prog-nm-inp" placeholder="e.g. My Bulk Plan"></div>
  <div id="prog-days-cont"></div>
  <button class="add-day-btn" onclick="addProgDay()">+ Add Day</button>
  <button class="btn-accent" onclick="saveProg()">Save Program</button>
</div>

<!-- EX PICKER -->
<div class="ex-picker" id="ex-picker">
  <div class="ex-panel">
    <div class="ep-hdr">
      <h3>Choose Exercise</h3>
      <input class="ep-search" type="text" placeholder="Search exercises..." oninput="filterEx(this.value)" id="ep-search">
    </div>
    <div class="mf-row" id="mf-row"></div>
    <div class="ex-list-wrap" id="ex-list"></div>
  </div>
</div>

<div class="toast" id="toast-el"></div>
`;

// ─── HELPERS ──────────────────────────────────────────────────
function googleSVG(){return`<svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>`;}
function toast(m){const t=document.getElementById('toast-el');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}
function openM(id){document.getElementById(id).classList.add('open');}
function closeM(id){document.getElementById(id).classList.remove('open');}
function closeFullM(id){document.getElementById(id).classList.remove('open');}
function q(id){return document.getElementById(id);}
function qv(id){return q(id)?.value||'';}

// ─── AUTH ─────────────────────────────────────────────────────
function authTab(t){
  q('login-form').classList.toggle('hidden',t!=='login');
  q('signup-form').classList.toggle('hidden',t!=='signup');
  document.querySelectorAll('.auth-tab').forEach((el,i)=>el.classList.toggle('active',(t==='login'&&i===0)||(t==='signup'&&i===1)));
}
async function doLogin(){
  const e=qv('l-email'),p=qv('l-pass');
  q('l-err').textContent='';
  if(!e||!p){q('l-err').textContent='Fill in all fields';return;}
  const {error}=await sb.auth.signInWithPassword({email:e,password:p});
  if(error)q('l-err').textContent=error.message;
}
async function doSignup(){
  const n=qv('s-name'),e=qv('s-email'),p=qv('s-pass');
  q('s-err').textContent='';
  if(!n||!e||!p){q('s-err').textContent='Fill in all fields';return;}
  if(p.length<6){q('s-err').textContent='Password must be at least 6 characters';return;}
  const {error}=await sb.auth.signUp({email:e,password:p,options:{data:{full_name:n}}});
  if(error)q('s-err').textContent=error.message;
  else{q('s-err').style.color='var(--green)';q('s-err').textContent='Check your email to confirm!';}
}
async function doGoogle(){await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.href}});}
async function doSignout(){toggleMenu();await sb.auth.signOut();}

// ─── INIT ─────────────────────────────────────────────────────
async function init(){
  const {data:{session}}=await sb.auth.getSession();
  if(session){CU=session.user;await loadData();showApp();}
  else showAuth();
  sb.auth.onAuthStateChange(async(ev,sess)=>{
    if(ev==='SIGNED_IN'&&sess){CU=sess.user;await loadData();showApp();}
    else if(ev==='SIGNED_OUT'){CU=null;UP=null;showAuth();}
  });
}

async function loadData(){
  const uid=CU.id;
  const [pr,wk,fl,wt,ms]=await Promise.all([
    sb.from('profiles').select('*').eq('id',uid).single(),
    sb.from('workout_logs').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(300),
    sb.from('food_logs').select('*').eq('user_id',uid).eq('logged_at',TODAY),
    sb.from('weight_logs').select('*').eq('user_id',uid).order('logged_at',{ascending:false}).limit(20),
    sb.from('measurements').select('*').eq('user_id',uid).order('logged_at',{ascending:false}).limit(10),
  ]);
  UP=pr.data;wkLogs=wk.data||[];foodLogs=fl.data||[];wtLogs=wt.data||[];measLogs=ms.data||[];
}

function showApp(){
  q('loading').style.display='none';
  q('auth-page').classList.add('hidden');
  q('main-app').classList.remove('hidden');
  if(!UP?.daily_calories){q('setup-page').classList.add('open');}
  else{renderAll();}
}
function showAuth(){
  q('loading').style.display='none';
  q('auth-page').classList.remove('hidden');
  q('main-app').classList.add('hidden');
}
function renderAll(){renderDash();renderWorkout();renderNut();renderPhotos();renderBody();renderProgs();}

// ─── SETUP ────────────────────────────────────────────────────
function setGoal(g,el){selGoal=g;document.querySelectorAll('.g-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');calcMacros();}
function setAct(a,el){selAct=a;document.querySelectorAll('.a-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');calcMacros();}
function setGender(g,el){selGender=g;document.querySelectorAll('#g-male,#g-female').forEach(b=>b.classList.remove('active'));el.classList.add('active');calcMacros();}
function openSetup(){
  toggleMenu();
  if(UP){
    q('su-cw').value=UP.current_weight||'';
    q('su-tw').value=UP.target_weight||'';
    q('su-ht').value=UP.height||'';
    if(UP.target_date)q('su-td').value=UP.target_date;
    if(UP.gender){
      selGender=UP.gender;
      document.querySelectorAll('#g-male,#g-female').forEach(b=>b.classList.remove('active'));
      const gb=q('g-'+UP.gender);if(gb)gb.classList.add('active');
    }
  }
  q('setup-page').classList.add('open');
}

function calcMacros(){
  const age=parseInt(qv('su-age'))||0,ht=parseFloat(qv('su-ht'))||0,wt=parseFloat(qv('su-cw'))||0;
  if(!age||!ht||!wt)return null;
  // Mifflin-St Jeor: male +5, female -161
  const bmr=10*wt+6.25*ht-5*age+(selGender==='female'?-161:5);
  const am={sedentary:1.2,light:1.375,moderate:1.55,very:1.725}[selAct]||1.55;
  const tdee=Math.round(bmr*am);
  let cal=tdee;
  if(selGoal==='deficit')cal=tdee-500;
  else if(selGoal==='surplus')cal=tdee+300;
  else if(selGoal==='recomp')cal=tdee-200; // Small deficit, higher protein
  // Recomp needs higher protein (2.2g/kg) to preserve muscle while losing fat
  const proMult=selGoal==='recomp'?2.4:2;
  const pro=Math.round(wt*proMult),fat=Math.round(cal*0.25/9),carb=Math.round((cal-pro*4-fat*9)/4);
  q('calc-box').style.display='block';
  q('cc').textContent=cal+' kcal';q('cp').textContent=pro+'g';q('ccb').textContent=carb+'g';q('cf').textContent=fat+'g';
  return{cal,pro,carb,fat};
}

async function calcAndSave(){
  const macros=calcMacros();if(!macros){toast('Fill in all fields');return;}
  const age=parseInt(qv('su-age')),ht=parseFloat(qv('su-ht')),cw=parseFloat(qv('su-cw')),tw=parseFloat(qv('su-tw')),td=qv('su-td');
  const {error}=await sb.from('profiles').upsert({
    id:CU.id,name:CU.user_metadata?.full_name||CU.email,
    height:ht,current_weight:cw,target_weight:tw,target_date:td||null,
    goal:selGoal,activity_level:selAct,gender:selGender,
    daily_calories:macros.cal,daily_protein:macros.pro,daily_carbs:macros.carb,daily_fat:macros.fat
  });
  if(!error){
    if(cw)await sb.from('weight_logs').insert({user_id:CU.id,weight:cw,logged_at:TODAY});
    await loadData();
    q('setup-page').classList.remove('open');
    renderAll();toast('Goals saved! 🎯');
  }
}

// ─── DASHBOARD ────────────────────────────────────────────────
function renderDash(){
  const p=UP;if(!p)return;
  const now=new Date(),hr=now.getHours();
  const greet=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  const name=(p.name||'').split(' ')[0]||'there';
  q('d-greet').textContent=greet+', '+name+' 👋';
  q('d-date').textContent=now.toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'long'});
  q('av-btn').textContent=(name[0]||'J').toUpperCase();
  if(p.current_weight&&p.target_weight){
    const lat=wtLogs[0]?.weight||p.current_weight,start=p.current_weight,tgt=p.target_weight;
    const total=Math.abs(start-tgt),done=Math.abs(start-lat),pct=total>0?Math.min(100,Math.round(done/total*100)):0;
    q('d-cw').textContent=lat+' kg';q('d-tw').textContent=tgt+' kg';
    q('d-prog').style.width=pct+'%';q('d-pct').textContent=pct+'% achieved';
    if(p.target_date){const wl=Math.max(0,Math.ceil((new Date(p.target_date)-now)/(7*24*60*60*1000)));q('d-wks').textContent=wl+' weeks left';}
    if(p.height){const bmi=(lat/((p.height/100)**2)).toFixed(1);q('d-bmi').textContent=bmi;const bl=bmi<18.5?'Underweight':bmi<25?'Healthy':bmi<30?'Overweight':'Obese';q('d-bmi-l').textContent=bl;}
  }
  const tc=foodLogs.reduce((a,f)=>a+f.calories,0),tp=foodLogs.reduce((a,f)=>a+f.protein,0),tcb=foodLogs.reduce((a,f)=>a+f.carbs,0),tf=foodLogs.reduce((a,f)=>a+f.fat,0);
  q('d-cal').textContent=Math.round(tc);q('d-cal-t').textContent=p.daily_calories||'—';
  const sb2=(bi,vi,v,t)=>{const pct=t?Math.min(100,Math.round(v/t*100)):0;q(bi).style.width=pct+'%';q(vi).textContent=Math.round(v)+' / '+(t||'—')+'g';};
  sb2('d-pb','d-pv',tp,p.daily_protein);sb2('d-cb','d-cv',tcb,p.daily_carbs);sb2('d-fb','d-fv',tf,p.daily_fat);
  const sess=new Set(wkLogs.map(l=>l.logged_at)).size;
  q('d-sess').textContent=sess;
  const vol=wkLogs.reduce((a,l)=>{const s=Array.isArray(l.sets)?l.sets:[];return a+s.filter(x=>x.done).reduce((b,x)=>b+(x.kg*x.reps),0);},0);
  q('d-vol').textContent=Math.round(vol).toLocaleString();
  let streak=0;const dates=[...new Set(wkLogs.map(l=>l.logged_at))].sort().reverse();let cd=new Date(TODAY);
  for(const d of dates){const ds=new Date(d).toISOString().split('T')[0],ex=cd.toISOString().split('T')[0];if(ds===ex){streak++;cd.setDate(cd.getDate()-1);}else break;}
  q('d-streak').textContent=streak;
}

// ─── WORKOUT ──────────────────────────────────────────────────
function renderWorkout(){
  q('wk-date').textContent=new Date().toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'short'});
  const loggedToday=new Set(wkLogs.filter(l=>l.logged_at===TODAY).map(l=>l.exercise_name));
  const c=q('wk-list');c.innerHTML='';
  PPL.days.forEach((day,di)=>{
    const card=document.createElement('div');card.className='gc day-card';
    card.innerHTML=`
      <div class="day-hdr" onclick="togDay(${di})">
        <span class="day-pill p-${day.type}">${day.label}</span>
        <span class="day-title">${day.name}</span>
        <span style="font-size:12px;color:var(--text2)">${day.exercises.length} ex</span>
        <span class="chev" id="chev-${di}">⌄</span>
      </div>
      <div class="day-body" id="db-${di}">
        ${day.exercises.map(ex=>{
          const logged=loggedToday.has(ex.name);
          const exData=EX.find(e=>e.name===ex.name);
          return `<div class="ex-row" onclick="openLog(${di},'${ex.name.replace(/'/g,"\\'")}')">
            <div class="ex-dot${logged?' done':''}"></div>
            <div class="ex-info"><div class="ex-name">${ex.name}</div><div class="ex-meta">${ex.sets} sets · ${ex.reps}</div></div>
            <div style="display:flex;align-items:center;gap:8px">
              ${exData?`<div class="ex-tut" onclick="event.stopPropagation();openTut('${ex.name.replace(/'/g,"\\'")}')">▶</div>`:''}
              <span style="color:var(--muted);font-size:14px">›</span>
            </div>
          </div>`;
        }).join('')}
      </div>`;
    c.appendChild(card);
  });
}

const openDays={};
function togDay(i){openDays[i]=!openDays[i];q('db-'+i).classList.toggle('open',openDays[i]);q('chev-'+i).classList.toggle('open',openDays[i]);}

// ─── LOG MODAL ────────────────────────────────────────────────
function openLog(di,nm){
  const day=PPL.days[di],ex=day.exercises.find(e=>e.name===nm);if(!ex)return;
  curDayIdx=di;curExName=nm;curExSets=ex.sets;
  q('lm-name').textContent=nm;q('lm-meta').textContent=`${ex.sets} sets · ${ex.reps}`;
  const prev=wkLogs.find(l=>l.exercise_name===nm),ps=prev?.sets||[];
  const best=prev?Math.max(...ps.filter(s=>s.done&&s.kg>0).map(s=>s.kg),0):0;
  q('lm-prev').textContent=best>0?`🏆 Last best: ${best}kg — beat it!`:'First time — note your starting weight';
  const c=q('sets-cont');c.innerHTML='';
  for(let i=0;i<ex.sets;i++){const p=ps[i];addSetEl(i+1,p?.kg||'',p?.reps||'');}
  rstTimer();openM('log-modal');
}

function addSetEl(n,kg='',rp=''){
  const c=q('sets-cont'),actualN=n||c.querySelectorAll('.set-row').length+1;
  const row=document.createElement('div');row.className='set-row';
  row.innerHTML=`<div class="set-n" id="sn-${actualN}">${actualN}</div><input class="set-inp" type="number" inputmode="decimal" placeholder="kg" value="${kg}" id="sk-${actualN}"><input class="set-inp" type="number" inputmode="numeric" placeholder="reps" value="${rp}" id="sr-${actualN}"><div class="set-chk" id="sc-${actualN}" onclick="tickSet(${actualN})">✓</div>`;
  c.appendChild(row);
}
function addSet(){const n=q('sets-cont').querySelectorAll('.set-row').length+1;addSetEl(n);}
function tickSet(n){
  const ch=q('sc-'+n),nm=q('sn-'+n),done=ch.classList.toggle('done');
  nm.classList.toggle('done',done);if(done){rstTimer();startTimer();}
}

async function saveLog(){
  const rows=q('sets-cont').querySelectorAll('.set-row');
  const sets=[...rows].map((r,i)=>{const n=i+1;return{kg:parseFloat(q('sk-'+n)?.value)||0,reps:parseInt(q('sr-'+n)?.value)||0,done:q('sc-'+n)?.classList.contains('done')};});
  const {error}=await sb.from('workout_logs').insert({user_id:CU.id,exercise_name:curExName,day_index:curDayIdx,logged_at:TODAY,sets});
  if(!error){
    const {data}=await sb.from('workout_logs').select('*').eq('user_id',CU.id).order('created_at',{ascending:false}).limit(300);
    wkLogs=data||[];closeM('log-modal');renderWorkout();renderDash();toast('✓ Session saved!');
  }
}

// ─── TUTORIAL ─────────────────────────────────────────────────
function openTut(nm){
  const ex=EX.find(e=>e.name===nm);if(!ex)return;
  q('tut-nm').textContent=nm;
  const c=MUSCLE_COLORS[ex.muscle]||'var(--accent)';
  q('tut-muscle').innerHTML=`<span style="background:${c}22;color:${c};padding:2px 10px;border-radius:99px;font-size:12px;font-weight:700">${ex.muscle}</span> · ${ex.eq}`;
  q('tut-cues').innerHTML=ex.cues.map((c2,i)=>`<div class="cue-item"><div class="cue-n">${i+1}</div><div style="font-size:14px;line-height:1.5;flex:1">${c2}</div></div>`).join('');
  curYT='https://www.youtube.com/results?search_query='+encodeURIComponent(ex.name+' proper form tutorial');openM('tut-modal');
}
function openYT(){if(curYT)window.open(curYT,'_blank');}

// ─── TIMER ────────────────────────────────────────────────────
function togTimer(){if(timerOn){clearInterval(timerIv);timerOn=false;q('t-btn').textContent='Resume';}else startTimer();}
function startTimer(){if(timerOn)return;timerOn=true;q('t-btn').textContent='Pause';timerIv=setInterval(()=>{if(timerSec>0){timerSec--;updTimer();}else{clearInterval(timerIv);timerOn=false;q('t-btn').textContent='Start';timerSec=90;updTimer();toast('Rest done — next set! 💪');}},1000);}
function rstTimer(){clearInterval(timerIv);timerOn=false;timerSec=90;q('t-btn').textContent='Start';q('td').classList.remove('urgent');updTimer();}
function updTimer(){const m=Math.floor(timerSec/60),s=timerSec%60;q('td').textContent=`${m}:${s.toString().padStart(2,'0')}`;q('td').classList.toggle('urgent',timerSec<=10);}

// ─── NUTRITION ────────────────────────────────────────────────
function renderNut(){
  q('nut-date').textContent=new Date().toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'short'});
  const p=UP,tc=foodLogs.reduce((a,f)=>a+f.calories,0),tp=foodLogs.reduce((a,f)=>a+f.protein,0),tcb=foodLogs.reduce((a,f)=>a+f.carbs,0),tf=foodLogs.reduce((a,f)=>a+f.fat,0);
  q('n-cal').textContent=Math.round(tc);q('n-cal-t').textContent=p?.daily_calories||'—';
  const left=(p?.daily_calories||0)-tc;q('n-left').textContent=left>=0?`${Math.round(left)} kcal remaining`:`${Math.round(Math.abs(left))} kcal over target`;
  const sb2=(bi,vi,v,t)=>{const pct=t?Math.min(100,Math.round(v/t*100)):0;q(bi).style.width=pct+'%';q(vi).textContent=Math.round(v)+'g / '+(t||'—')+'g';};
  sb2('n-pb','n-pv',tp,p?.daily_protein);sb2('n-cb','n-cv',tcb,p?.daily_carbs);sb2('n-fb','n-fv',tf,p?.daily_fat);
  const meals=['breakfast','lunch','dinner','snack'];
  const icons={breakfast:'🌅 Breakfast',lunch:'☀️ Lunch',dinner:'🌙 Dinner',snack:'🍎 Snack'};
  q('meal-secs').innerHTML=meals.map(m=>{
    const items=foodLogs.filter(f=>f.meal_type===m),mc=items.reduce((a,f)=>a+f.calories,0);
    return `<div class="meal-sec">
      <div class="meal-hdr"><div class="meal-name">${icons[m]}${mc>0?' · '+Math.round(mc)+' kcal':''}</div><button class="add-food-btn" onclick="openFoodSearch('${m}')">+ Add</button></div>
      <div class="gc">${items.length?items.map(f=>`<div class="food-item"><div class="food-info"><div class="food-nm">${f.food_name}</div><div class="food-mt">${f.quantity}g · P:${Math.round(f.protein)}g C:${Math.round(f.carbs)}g F:${Math.round(f.fat)}g</div></div><div class="food-cal">${Math.round(f.calories)}</div><button class="food-del" onclick="delFood('${f.id}')">×</button></div>`).join(''):'<div class="empty-meal">Nothing logged yet</div>'}</div>
    </div>`;
  }).join('');
}


// Common foods fallback database
function commonFoods(query){
  const db=[
    {product_name:"Chicken Breast (grilled)",brands:"Generic",nutriments:{"energy-kcal_100g":165,"proteins_100g":31,"carbohydrates_100g":0,"fat_100g":3.6}},
    {product_name:"Chicken Maryland (grilled)",brands:"Generic",nutriments:{"energy-kcal_100g":218,"proteins_100g":25,"carbohydrates_100g":0,"fat_100g":12}},
    {product_name:"White Rice (cooked)",brands:"Generic",nutriments:{"energy-kcal_100g":130,"proteins_100g":2.7,"carbohydrates_100g":28,"fat_100g":0.3}},
    {product_name:"Sella Basmati Rice (cooked)",brands:"Generic",nutriments:{"energy-kcal_100g":121,"proteins_100g":2.8,"carbohydrates_100g":25,"fat_100g":0.4}},
    {product_name:"Brown Rice (cooked)",brands:"Generic",nutriments:{"energy-kcal_100g":112,"proteins_100g":2.6,"carbohydrates_100g":23,"fat_100g":0.9}},
    {product_name:"Eggs (whole)",brands:"Generic",nutriments:{"energy-kcal_100g":155,"proteins_100g":13,"carbohydrates_100g":1.1,"fat_100g":11}},
    {product_name:"Egg White",brands:"Generic",nutriments:{"energy-kcal_100g":52,"proteins_100g":11,"carbohydrates_100g":0.7,"fat_100g":0.2}},
    {product_name:"Oats",brands:"Generic",nutriments:{"energy-kcal_100g":389,"proteins_100g":17,"carbohydrates_100g":66,"fat_100g":7}},
    {product_name:"Banana",brands:"Generic",nutriments:{"energy-kcal_100g":89,"proteins_100g":1.1,"carbohydrates_100g":23,"fat_100g":0.3}},
    {product_name:"Apple",brands:"Generic",nutriments:{"energy-kcal_100g":52,"proteins_100g":0.3,"carbohydrates_100g":14,"fat_100g":0.2}},
    {product_name:"Greek Yogurt (plain)",brands:"Generic",nutriments:{"energy-kcal_100g":59,"proteins_100g":10,"carbohydrates_100g":3.6,"fat_100g":0.4}},
    {product_name:"Milk (full fat)",brands:"Generic",nutriments:{"energy-kcal_100g":61,"proteins_100g":3.2,"carbohydrates_100g":4.8,"fat_100g":3.3}},
    {product_name:"Oat Milk",brands:"Generic",nutriments:{"energy-kcal_100g":47,"proteins_100g":1,"carbohydrates_100g":7,"fat_100g":1.5}},
    {product_name:"Whey Protein Powder",brands:"Generic",nutriments:{"energy-kcal_100g":400,"proteins_100g":80,"carbohydrates_100g":8,"fat_100g":5}},
    {product_name:"Salmon (grilled)",brands:"Generic",nutriments:{"energy-kcal_100g":208,"proteins_100g":20,"carbohydrates_100g":0,"fat_100g":13}},
    {product_name:"Tuna (canned in water)",brands:"Generic",nutriments:{"energy-kcal_100g":116,"proteins_100g":26,"carbohydrates_100g":0,"fat_100g":1}},
    {product_name:"Beef (lean mince)",brands:"Generic",nutriments:{"energy-kcal_100g":215,"proteins_100g":26,"carbohydrates_100g":0,"fat_100g":12}},
    {product_name:"Broccoli",brands:"Generic",nutriments:{"energy-kcal_100g":34,"proteins_100g":2.8,"carbohydrates_100g":7,"fat_100g":0.4}},
    {product_name:"Sweet Potato",brands:"Generic",nutriments:{"energy-kcal_100g":86,"proteins_100g":1.6,"carbohydrates_100g":20,"fat_100g":0.1}},
    {product_name:"Avocado",brands:"Generic",nutriments:{"energy-kcal_100g":160,"proteins_100g":2,"carbohydrates_100g":9,"fat_100g":15}},
    {product_name:"Almonds",brands:"Generic",nutriments:{"energy-kcal_100g":579,"proteins_100g":21,"carbohydrates_100g":22,"fat_100g":50}},
    {product_name:"Peanut Butter",brands:"Generic",nutriments:{"energy-kcal_100g":588,"proteins_100g":25,"carbohydrates_100g":20,"fat_100g":50}},
    {product_name:"Olive Oil",brands:"Generic",nutriments:{"energy-kcal_100g":884,"proteins_100g":0,"carbohydrates_100g":0,"fat_100g":100}},
    {product_name:"Bread (white)",brands:"Generic",nutriments:{"energy-kcal_100g":265,"proteins_100g":9,"carbohydrates_100g":49,"fat_100g":3.2}},
    {product_name:"Bread (wholemeal)",brands:"Generic",nutriments:{"energy-kcal_100g":247,"proteins_100g":13,"carbohydrates_100g":41,"fat_100g":3.4}},
    {product_name:"Pasta (cooked)",brands:"Generic",nutriments:{"energy-kcal_100g":131,"proteins_100g":5,"carbohydrates_100g":25,"fat_100g":1.1}},
    {product_name:"Cottage Cheese",brands:"Generic",nutriments:{"energy-kcal_100g":98,"proteins_100g":11,"carbohydrates_100g":3.4,"fat_100g":4.3}},
    {product_name:"Protein Bar",brands:"Generic",nutriments:{"energy-kcal_100g":370,"proteins_100g":30,"carbohydrates_100g":35,"fat_100g":10}},
    {product_name:"Iced Coffee (black)",brands:"Generic",nutriments:{"energy-kcal_100g":5,"proteins_100g":0.3,"carbohydrates_100g":0.7,"fat_100g":0}},
    {product_name:"Orange Juice",brands:"Generic",nutriments:{"energy-kcal_100g":45,"proteins_100g":0.7,"carbohydrates_100g":10,"fat_100g":0.2}},
  ];
  if(!query)return db.slice(0,10);
  const q2=query.toLowerCase();
  return db.filter(f=>f.product_name.toLowerCase().includes(q2)).slice(0,10);
}


// AI Food Parser
async function parseWithAI(text, meal) {
  if(!text.trim()) return;
  const btn = q('ai-parse-btn');
  btn.textContent = 'Analysing...';
  btn.disabled = true;
  try {
    const res = await fetch('/api/nutrition', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text})
    });
    const data = await res.json();
    if(data.error) throw new Error(data.error);
    // Show results for review
    window._aifoods = data.foods;
    renderAIResults(data.foods, meal);
  } catch(e) {
    toast('Could not parse — try again');
    console.error(e);
  } finally {
    btn.textContent = 'Analyse';
    btn.disabled = false;
  }
}

function renderAIResults(foods, meal) {
  const total = {cal:0, pro:0, carb:0, fat:0};
  foods.forEach(f=>{total.cal+=f.calories;total.pro+=f.protein;total.carb+=f.carbs;total.fat+=f.fat;});
  q('ai-results').innerHTML = `
    <div style="margin-bottom:12px">
      ${foods.map((f,i)=>`
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
          <div style="flex:1">
            <div style="font-size:14px;font-weight:500">${f.name}</div>
            <div style="font-size:12px;color:var(--text2);margin-top:2px">P:${f.protein}g · C:${f.carbs}g · F:${f.fat}g</div>
          </div>
          <div style="font-size:15px;font-weight:700;color:var(--accent)">${Math.round(f.calories)} kcal</div>
          <div onclick="removeAIFood(${i})" style="color:var(--red);cursor:pointer;font-size:18px;padding:0 4px">×</div>
        </div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid var(--border2)">
      <div>
        <div style="font-size:12px;color:var(--text2)">Total</div>
        <div style="font-size:13px;margin-top:2px">P:${Math.round(total.pro)}g · C:${Math.round(total.carb)}g · F:${Math.round(total.fat)}g</div>
      </div>
      <div style="font-size:20px;font-weight:800;color:var(--accent)">${Math.round(total.cal)} kcal</div>
    </div>
    <button class="btn-accent" style="margin-top:12px" onclick="addAIFoods('${meal}')">Add All to ${meal.charAt(0).toUpperCase()+meal.slice(1)}</button>
  `;
}

function removeAIFood(i) {
  window._aifoods.splice(i,1);
  if(window._aifoods.length === 0) {q('ai-results').innerHTML='';return;}
  renderAIResults(window._aifoods, selMeal);
}

async function addAIFoods(meal) {
  if(!window._aifoods?.length) return;
  const inserts = window._aifoods.map(f=>({
    user_id:CU.id, food_name:f.name, brand:'AI estimated',
    calories:f.calories, protein:f.protein, carbs:f.carbs, fat:f.fat,
    quantity:f.quantity||100, unit:f.unit||'g', meal_type:meal, logged_at:TODAY
  }));
  const {data, error} = await sb.from('food_logs').insert(inserts).select();
  if(!error && data) {
    foodLogs.push(...data);
    closeM('food-modal');
    renderNut(); renderDash();
    toast('Added to '+meal+'! 🍽️');
    window._aifoods = [];
    q('ai-food-input').value = '';
    q('ai-results').innerHTML = '';
  }
}

let fsTimer=null;
function openFoodSearch(meal){
  selMeal=meal;
  if(q('fs-inp'))q('fs-inp').value='';
  if(q('food-res'))q('food-res').innerHTML='<div class="food-loading">Search for food above</div>';
  if(q('ai-food-input'))q('ai-food-input').value='';
  if(q('ai-results'))q('ai-results').innerHTML='';
  document.querySelectorAll('.mt-btn').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase()===meal));
  q('food-modal-meal-label').textContent='Adding to: '+meal.charAt(0).toUpperCase()+meal.slice(1);
  openM('food-modal');
}
function srchFood(val){
  clearTimeout(fsTimer);if(!val.trim()){q('food-res').innerHTML='<div class="food-loading">Search for food above</div>';return;}
  q('food-res').innerHTML='<div class="food-loading">Searching...</div>';
  fsTimer=setTimeout(async()=>{
    try{
      // Try Open Food Facts v2 API - faster endpoint
      const r=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(val)}&search_simple=1&action=process&json=1&page_size=20&fields=product_name,brands,nutriments,image_small_url`,{signal:AbortSignal.timeout(8000)});
      const d=await r.json();
      let prods=(d.products||[]).filter(p=>p.product_name&&p.nutriments&&(p.nutriments['energy-kcal_100g']||p.nutriments['energy_100g']));
      if(!prods.length){q('food-res').innerHTML='<div class="food-loading">No results — try a different search term</div>';return;}
      window._fr=prods;
      q('food-res').innerHTML=prods.map((p,i)=>{
        const cal=Math.round(p.nutriments['energy-kcal_100g']||p.nutriments['energy_100g']/4.184||0);
        return `<div class="fr-item" onclick="selFood(${i})"><div class="fr-name">${p.product_name||'Unknown'}</div><div class="fr-brand">${p.brands||'Generic'}</div><div class="fr-cal">${cal} kcal per 100g</div></div>`;
      }).join('');
    }catch(e){
      // Fallback: show common foods manually
      const common=commonFoods(val);
      if(common.length){window._fr=common;q('food-res').innerHTML=common.map((p,i)=>`<div class="fr-item" onclick="selFood(${i})"><div class="fr-name">${p.product_name}</div><div class="fr-brand">${p.brands}</div><div class="fr-cal">${Math.round(p.nutriments['energy-kcal_100g'])} kcal per 100g</div></div>`).join('');}
      else q('food-res').innerHTML='<div class="food-loading">No results — try again</div>';
    }
  },400);
}
function selFood(i){
  const p=window._fr[i];if(!p)return;
  curFood={name:p.product_name||p.nm||'Unknown',brand:p.brands||p.br||'',c100:p.nutriments?.['energy-kcal_100g']||p.nutriments?.['energy_100g']/4.184||p.c100||0,p100:p.nutriments?.['proteins_100g']||p.p100||0,cb100:p.nutriments?.['carbohydrates_100g']||p.cb100||0,f100:p.nutriments?.['fat_100g']||p.f100||0};
  q('fd-nm').textContent=curFood.name;q('fd-br').textContent=curFood.brand;q('fd-qty').value=100;updFood();
  document.querySelectorAll('.mt-btn').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase()===selMeal));
  closeM('food-modal');openM('fd-modal');
}
function updFood(){
  if(!curFood)return;const qty=parseFloat(qv('fd-qty'))||100,f=qty/100;
  q('fd-c').textContent=Math.round(curFood.c100*f);q('fd-p').textContent=Math.round(curFood.p100*f*10)/10;
  q('fd-cb').textContent=Math.round(curFood.cb100*f*10)/10;q('fd-f').textContent=Math.round(curFood.f100*f*10)/10;
}
function selMealType(t,el){selMeal=t;document.querySelectorAll('.mt-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');}
async function addFood(){
  if(!curFood)return;const qty=parseFloat(qv('fd-qty'))||100,f=qty/100;
  const {data,error}=await sb.from('food_logs').insert({user_id:CU.id,food_name:curFood.name,brand:curFood.brand,calories:curFood.c100*f,protein:curFood.p100*f,carbs:curFood.cb100*f,fat:curFood.f100*f,quantity:qty,unit:'g',meal_type:selMeal,logged_at:TODAY}).select().single();
  if(!error&&data){foodLogs.push(data);closeM('fd-modal');renderNut();renderDash();toast('Food added! 🍽️');}
}
async function delFood(id){
  await sb.from('food_logs').delete().eq('id',id);
  foodLogs=foodLogs.filter(f=>f.id!==id);renderNut();renderDash();toast('Removed');
}

// ─── PHOTOS ───────────────────────────────────────────────────
const ANGLES=['Front','Back','Left','Right'];
function getWkDate(){const d=new Date();d.setDate(d.getDate()+photoWeekOff*7);d.setDate(d.getDate()-d.getDay());return d.toISOString().split('T')[0];}
function chgPhotoWk(dir){if(dir>0&&photoWeekOff>=0)return;photoWeekOff+=dir;renderPhotos();}

async function renderPhotos(){
  const wd=getWkDate();
  const lbl=photoWeekOff===0?'This week':photoWeekOff===-1?'Last week':new Date(wd).toLocaleDateString('en-AU',{month:'short',day:'numeric'});
  q('ph-wk-lbl').textContent=lbl;
  const {data:photos}=await sb.from('progress_photos').select('*').eq('user_id',CU.id).eq('week_date',wd);
  // Refresh signed URLs for display
  const pm={};
  for(const p of (photos||[])){
    if(p.storage_path){
      const {data:sd}=await sb.storage.from('progress-photos').createSignedUrl(p.storage_path,3600);
      if(sd)p.photo_url=sd.signedUrl;
    }
    pm[p.angle]=p;
  }
  q('angles-grid').innerHTML=ANGLES.map(a=>{
    const ph=pm[a];
    if(ph)return`<div class="angle-card" onclick="window.open('${ph.photo_url}','_blank')"><img src="${ph.photo_url}" alt="${a}"><div class="angle-lbl">${a}</div></div>`;
    return`<label class="angle-card" style="cursor:pointer"><div style="font-size:28px;color:var(--muted)">📷</div><div style="font-size:12px;color:var(--muted)">${a}</div><input type="file" accept="image/*" capture="user" style="display:none" onchange="uploadPhoto(event,'${a}','${wd}')"></label>`;
  }).join('');
  const {data:ap}=await sb.from('progress_photos').select('week_date').eq('user_id',CU.id);
  photoWeeks=[...new Set((ap||[]).map(p=>p.week_date))].sort();
}

async function uploadPhoto(ev,angle,wd){
  const file=ev.target.files[0];if(!file)return;toast('Uploading...');
  const path=`${CU.id}/${wd}_${angle}.jpg`;
  const {error:ue}=await sb.storage.from('progress-photos').upload(path,file,{upsert:true});
  if(ue){toast('Upload failed');return;}
  // Use signed URL (expires in 1 year = 31536000 seconds) for private storage
  const {data:signedData,error:signErr}=await sb.storage.from('progress-photos').createSignedUrl(path,31536000);
  if(signErr){toast('Error saving photo');return;}
  await sb.from('progress_photos').upsert({user_id:CU.id,week_date:wd,angle,photo_url:signedData.signedUrl,storage_path:path});
  renderPhotos();toast('Photo saved! 📸');
}

// ─── COMPARE ──────────────────────────────────────────────────
function openCompare(){
  const sa=q('cmp-a'),sb2=q('cmp-b');
  const opts='<option value="">Select week</option>'+photoWeeks.map(w=>`<option value="${w}">${new Date(w).toLocaleDateString('en-AU',{month:'short',day:'numeric'})}</option>`).join('');
  sa.innerHTML=opts;sb2.innerHTML=opts;
  q('sl-wrap').innerHTML='<div class="no-photos">Select two weeks to compare</div>';
  openM('cmp-modal');
}
function setCmpAngle(a,el){cmpAngle=a;document.querySelectorAll('.ang-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');loadCmp();}
async function loadCmp(){
  const wa=q('cmp-a').value,wb=q('cmp-b').value;if(!wa||!wb)return;
  const {data:photos}=await sb.from('progress_photos').select('*').eq('user_id',CU.id).in('week_date',[wa,wb]).eq('angle',cmpAngle);
  const pa=photos?.find(p=>p.week_date===wa),pb=photos?.find(p=>p.week_date===wb);
  const c=q('sl-wrap');
  if(!pa||!pb){c.innerHTML=`<div class="no-photos">No ${cmpAngle} photos for selected weeks</div>`;return;}
  const la=new Date(wa).toLocaleDateString('en-AU',{month:'short',day:'numeric'}),lb=new Date(wb).toLocaleDateString('en-AU',{month:'short',day:'numeric'});
  c.innerHTML=`<img class="sl-img" src="${pa.photo_url}"><img class="sl-img-r" id="sl-r" src="${pb.photo_url}"><div class="sl-line" id="sl-ln"></div><div class="sl-handle" id="sl-h">⟺</div><div class="sl-lbl-l">${la}</div><div class="sl-lbl-r">${lb}</div>`;
  setupSlider();
}
function setupSlider(){
  const h=q('sl-h'),ln=q('sl-ln'),ri=q('sl-r'),c=q('sl-wrap');let drag=false;
  const mv=x=>{const r=c.getBoundingClientRect(),pct=Math.max(0,Math.min(100,(x-r.left)/r.width*100));h.style.left=pct+'%';ln.style.left=pct+'%';ri.style.clipPath=`inset(0 0 0 ${pct}%)`;};
  h.addEventListener('mousedown',()=>drag=true);h.addEventListener('touchstart',()=>drag=true,{passive:true});
  window.addEventListener('mousemove',e=>{if(drag)mv(e.clientX);});
  window.addEventListener('touchmove',e=>{if(drag)mv(e.touches[0].clientX);},{passive:true});
  window.addEventListener('mouseup',()=>drag=false);window.addEventListener('touchend',()=>drag=false);
}

// ─── BODY ─────────────────────────────────────────────────────
function renderBody(){renderWtHist();renderMeasHist();if(UP?.height&&wtLogs.length)updBMI(wtLogs[0].weight);}
function updBMI(wt){
  if(!UP?.height||!wt)return;const bmi=(wt/((UP.height/100)**2)).toFixed(1);
  q('bmi-v').textContent=bmi;
  const l=bmi<18.5?'Underweight':bmi<25?'Healthy Weight':bmi<30?'Overweight':'Obese';
  const c=bmi<18.5?'var(--blue)':bmi<25?'var(--green)':bmi<30?'#f0b840':'var(--red)';
  q('bmi-l').textContent=l;q('bmi-l').style.color=c;
}
function renderWtHist(){
  const h=q('wt-hist');
  if(!wtLogs.length){h.innerHTML='<div style="padding:16px;color:var(--muted);font-size:14px">No weight logged yet</div>';return;}
  h.innerHTML=wtLogs.slice(0,10).map((w,i)=>{
    const prev=wtLogs[i+1],diff=prev?(w.weight-prev.weight).toFixed(1):null;
    const ch=diff?`<span class="${diff>0?'wch-up':'wch-dn'}">${diff>0?'+':''}${diff} kg</span>`:'';
    return`<div class="gc wh-item"><div style="font-size:13px;color:var(--text2)">${new Date(w.logged_at).toLocaleDateString('en-AU',{weekday:'short',day:'numeric',month:'short'})}</div><div style="display:flex;align-items:center;gap:8px"><div style="font-size:16px;font-weight:700">${w.weight} kg</div>${ch}</div></div>`;
  }).join('');
  renderWtChart();
}
function renderWtChart(){
  const svg=q('wt-chart');
  if(!svg)return;
  const data=wtLogs.slice(0,8).reverse();
  if(data.length<2){svg.innerHTML='';return;}
  const pw=Math.max(100, (svg.parentElement?.clientWidth||300)-32);
  const h=80;
  svg.setAttribute('viewBox',`0 0 ${pw} ${h}`);
  const ws=data.map(d=>d.weight);
  const mn=Math.min(...ws)-1, mx=Math.max(...ws)+1;
  const range=mx-mn||1;
  const xs=data.length>1?pw/(data.length-1):pw;
  const pts=data.map((d,i)=>`${i*xs},${h-(d.weight-mn)/range*h}`).join(' ');
  svg.innerHTML=`<defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs><polygon points="${pts} ${(data.length-1)*xs},${h} 0,${h}" fill="url(#wg)"/><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>${data.map((d,i)=>`<circle cx="${i*xs}" cy="${h-(d.weight-mn)/range*h}" r="3" fill="var(--accent)"/>`).join('')}`;
}
async function logWeight(){
  const v=parseFloat(qv('wt-inp'));if(!v){toast('Enter a weight');return;}
  const {data,error}=await sb.from('weight_logs').insert({user_id:CU.id,weight:v,logged_at:TODAY}).select().single();
  if(!error){wtLogs.unshift(data);await sb.from('profiles').update({current_weight:v}).eq('id',CU.id);if(UP)UP.current_weight=v;q('wt-inp').value='';renderWtHist();updBMI(v);renderDash();toast('Weight logged! ⚖️');}
}
function renderMeasHist(){
  const el=q('meas-hist');
  if(!measLogs.length){el.innerHTML='<div style="padding:16px;color:var(--muted);font-size:14px">No measurements yet</div>';return;}
  el.innerHTML=measLogs.slice(0,5).map(m=>`<div class="gc" style="padding:12px 14px;margin-bottom:6px"><div style="font-size:12px;color:var(--text2);margin-bottom:6px">${new Date(m.logged_at).toLocaleDateString('en-AU',{day:'numeric',month:'short'})}</div><div style="display:flex;gap:6px;flex-wrap:wrap">${['chest','waist','hips','left_arm','right_arm','thigh'].filter(k=>m[k]).map(k=>`<span style="background:var(--surface2);border-radius:6px;padding:3px 8px;font-size:12px">${k.replace('_',' ')} ${m[k]}cm</span>`).join('')}</div></div>`).join('');
}
async function logMeas(){
  const g=id=>parseFloat(q(id)?.value)||null;
  const payload={user_id:CU.id,logged_at:TODAY,chest:g('m-chest'),waist:g('m-waist'),hips:g('m-hips'),left_arm:g('m-larm'),right_arm:g('m-rarm'),thigh:g('m-thigh')};
  if(!Object.values(payload).some(v=>typeof v==='number')){toast('Enter at least one measurement');return;}
  const {data,error}=await sb.from('measurements').insert(payload).select().single();
  if(!error){measLogs.unshift(data);renderMeasHist();toast('Measurements saved! 📏');}
}

// ─── PROGRAMS ─────────────────────────────────────────────────
async function renderProgs(){
  const {data}=await sb.from('programs').select('*').eq('user_id',CU.id);allProgs=data||[];
  q('prog-list').innerHTML=`
    <div class="gc prog-card"><div class="prog-icon" style="background:var(--accent-bg)">🏋️</div><div class="prog-info"><div class="prog-nm">JFit PPL (5-Day)</div><div class="prog-sb">Push · Pull · Legs · Push+Abs · Pull+Legs</div></div><div class="prog-badge">Active</div></div>
    ${allProgs.map(p=>`<div class="gc prog-card"><div class="prog-icon" style="background:var(--blue-bg)">📋</div><div class="prog-info"><div class="prog-nm">${p.name}</div><div class="prog-sb">Custom program</div></div></div>`).join('')}`;
}
function goToPrograms(){toggleMenu();goPage('programs',null);}
function openCreateProg(){progDayCount=0;q('prog-nm-inp').value='';q('prog-days-cont').innerHTML='';addProgDay();q('create-prog').classList.add('open');}
function addProgDay(){
  progDayCount++;const n=progDayCount;const c=q('prog-days-cont');
  const div=document.createElement('div');div.className='day-builder';div.id=`pd-${n}`;
  div.innerHTML=`<div class="db-hdr"><input class="db-name" type="text" placeholder="Day ${n} name (e.g. Push)" id="pdn-${n}"><button class="add-ex-day" onclick="openExPicker(${n})">+ Add Exercise</button></div><div id="pde-${n}"></div>`;
  c.appendChild(div);
}
function openExPicker(dayId){pickerDayId=dayId;q('ep-search').value='';renderMF();renderExList('','All');q('ex-picker').classList.add('open');}
function renderMF(){const ms=['All',...new Set(EX.map(e=>e.muscle))];q('mf-row').innerHTML=ms.map(m=>`<div class="mf-btn${m==='All'?' active':''}" onclick="filterMuscle('${m}',this)">${m}</div>`).join('');}
function filterMuscle(m,el){document.querySelectorAll('.mf-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');renderExList(qv('ep-search'),m);}
function filterEx(v){const am=document.querySelector('.mf-btn.active')?.textContent||'All';renderExList(v,am);}
function renderExList(q2,muscle){
  const f=EX.filter(e=>(!q2||e.name.toLowerCase().includes(q2.toLowerCase()))&&(muscle==='All'||e.muscle===muscle));
  const c=MUSCLE_COLORS;
  q('ex-list').innerHTML=f.map(e=>`<div class="ep-item" onclick="pickEx('${e.name.replace(/'/g,"\\'")}','${e.muscle}')"><span class="ep-muscle" style="background:${c[e.muscle]||'var(--accent)'}22;color:${c[e.muscle]||'var(--accent)'}">${e.muscle}</span><span class="ep-nm">${e.name}</span><span class="ep-eq">${e.eq}</span></div>`).join('');
}
function pickEx(nm,muscle){
  const c=q(`pde-${pickerDayId}`),n=c.querySelectorAll('.pex-row').length+1;
  const row=document.createElement('div');row.className='pex-row';row.dataset.nm=nm;
  row.innerHTML=`<div class="pex-nm">${nm}</div><div class="pex-lbl">Sets</div><input class="pex-inp" type="number" value="3" min="1"><div class="pex-lbl">Reps</div><input class="pex-inp" type="text" value="8–12" style="width:56px"><button class="rm-ex" onclick="this.parentElement.remove()">×</button>`;
  c.appendChild(row);q('ex-picker').classList.remove('open');
}
async function saveProg(){
  const nm=qv('prog-nm-inp').trim();if(!nm){toast('Enter a program name');return;}
  const {data:prog,error}=await sb.from('programs').insert({user_id:CU.id,name:nm}).select().single();
  if(error){toast('Error saving');return;}
  for(let d=1;d<=progDayCount;d++){
    const dn=qv(`pdn-${d}`)||`Day ${d}`;
    const {data:dr}=await sb.from('program_days').insert({program_id:prog.id,day_number:d,day_name:dn}).select().single();
    const exRows=q(`pde-${d}`)?.querySelectorAll('.pex-row')||[];
    for(let i=0;i<exRows.length;i++){
      const ins=exRows[i].querySelectorAll('input');
      await sb.from('program_exercises').insert({day_id:dr.id,exercise_name:exRows[i].dataset.nm,sets:parseInt(ins[0].value)||3,reps:ins[1].value||'8–12',order_index:i});
    }
  }
  q('create-prog').classList.remove('open');renderProgs();toast('Program saved! 🎉');
}

// ─── NAVIGATION ───────────────────────────────────────────────
function goPage(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  q('page-'+id)?.classList.add('active');
  if(btn)btn.classList.add('active');
  document.querySelector('.page-scroll')?.scrollTo(0,0);
  if(id==='nutrition')renderNut();
  if(id==='photos')renderPhotos();
  if(id==='body')renderBody();
  if(id==='programs')renderProgs();
  if(id==='dashboard')renderDash();
}

function toggleMenu(){q('prof-menu').classList.toggle('open');}
document.addEventListener('click',e=>{if(!e.target.closest('#prof-menu')&&!e.target.closest('#av-btn'))q('prof-menu')?.classList.remove('open');});
document.querySelectorAll('.modal-ov').forEach(el=>el.addEventListener('click',function(e){if(e.target===this)closeM(this.id);}));

// ─── SERVICE WORKER ───────────────────────────────────────────
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

// ─── START ────────────────────────────────────────────────────
init();
