// ===== DATOS INICIALES =====
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let points = parseInt(localStorage.getItem('points')) || 0;
let streak = parseInt(localStorage.getItem('streak')) || 0;
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
let goal = localStorage.getItem('goal') || '';

// ===== GUARDAR DATOS =====
function save(){
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('points', points);
  localStorage.setItem('streak', streak);
  localStorage.setItem('bestStreak', bestStreak);
  localStorage.setItem('goal', goal);
}

// ===== AÑADIR HÁBITO =====
function addHabit(){
  let name = document.getElementById('habitName').value.trim();
  let category = document.getElementById('habitCategory').value.trim();
  let priority = document.getElementById('habitPriority').value;

  if(!name) return;

  habits.push({name, category, priority, done:false, favorite:false});
  document.getElementById('habitName').value = '';
  document.getElementById('habitCategory').value = '';

  save();
  render();
}

// ===== TOGGLE HÁBITO =====
function toggleHabit(index){
  habits[index].done = !habits[index].done;

  if(habits[index].done){
    points += 10;
  } else {
    points -= 10;
  }

  updateStreak();
  save();
  render();
}

// ===== ELIMINAR HÁBITO =====
function removeHabit(index){
  habits.splice(index,1);
  save();
  render();
}

// ===== FAVORITO =====
function toggleFavorite(index){
  habits[index].favorite = !habits[index].favorite;
  save();
  render();
}

// ===== FILTROS =====
function filterCompleted(){
  render(habits.filter(h=>h.done));
}

function filterPending(){
  render(habits.filter(h=>!h.done));
}

function filterFavorites(){
  render(habits.filter(h=>h.favorite));
}

function showAll(){
  render();
}

function filterHabits(){
  let term = document.getElementById('searchInput').value.toLowerCase();
  render(habits.filter(h=>h.name.toLowerCase().includes(term)));
}

// ===== PROGRESO =====
function updateProgress(){
  let completed = habits.filter(h=>h.done).length;
  let total = habits.length;
  let progress = total ? Math.round((completed/total)*100) : 0;

  document.getElementById('progressText').innerText = progress + '%';
  document.getElementById('progressBar').style.width = progress + '%';
}

// ===== RACHAS =====
function updateStreak(){
  let completed = habits.filter(h=>h.done).length;
  let total = habits.length;
  let progress = total ? Math.round((completed/total)*100) : 0;

  if(progress === 100 && total>0){
    streak++;
  } else if(progress < 100){
    streak = 0;
  }

  if(streak > bestStreak) bestStreak = streak;

  document.getElementById('streak').innerText = streak + ' días';
  document.getElementById('bestStreak').innerText = bestStreak + ' días';
}

// ===== NIVELES =====
function updateLevel(){
  let level = Math.floor(points/50) + 1;
  document.getElementById('level').innerText = 'Nivel ' + level;
}

// ===== METAS =====
function setGoal(){
  goal = document.getElementById('goalInput').value.trim();
  localStorage.setItem('goal', goal);
  document.getElementById('goalDisplay').innerText = 'Meta: ' + goal;
  updateGoalStatus();
}

function updateGoalStatus(){
  let completed = habits.filter(h=>h.done).length;
  let total = habits.length;
  let progress = total ? Math.round((completed/total)*100) : 0;

  if(goal && progress >= parseInt(goal)){
    document.getElementById('goalStatus').innerText = 'Meta alcanzada ✅';
  } else if(goal){
    document.getElementById('goalStatus').innerText = 'Meta no alcanzada ❌';
  } else {
    document.getElementById('goalStatus').innerText = 'No definida';
  }
}

// ===== ESTADÍSTICAS =====
function updateStats(){
  let completed = habits.filter(h=>h.done).length;
  document.getElementById('totalCompleted').innerText = completed;

  let weeklyAverage = habits.length ? Math.round((completed/habits.length)*100) : 0;
  document.getElementById('weeklyAverage').innerText = weeklyAverage + '%';
}

// ===== RENDER =====
function render(filteredHabits = null){
  let list = document.getElementById('habitList');
  list.innerHTML = '';

  let displayHabits = filteredHabits || habits;

  displayHabits.forEach((h,i)=>{
    let div = document.createElement('div');
    div.className='card';

    div.innerHTML = `
      <strong>${h.name}</strong> [${h.category}] (${h.priority})<br><br>
      <button onclick="toggleHabit(${i})">${h.done?'✔ Completado':'Completar'}</button>
      <button onclick="toggleFavorite(${i})">${h.favorite?'⭐ Favorito':'Favorito'}</button>
      <button onclick="removeHabit(${i})">Eliminar ❌</button>
    `;

    list.appendChild(div);
  });

  updateProgress();
  updateStreak();
  updateLevel();
  updateGoalStatus();
  updateStats();
}

// ===== INICIO =====
document.getElementById('goalInput').value = goal;
render();