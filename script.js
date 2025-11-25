// Get references to DOM elements
const dot = document.querySelector('.dot');
const body = document.body;
const debugToggle = document.getElementById('debugToggle');
const verticalLine = document.querySelector('.vertical-line');
const horizontalLine = document.querySelector('.horizontal-line');
const leaderboardScores = document.getElementById('leaderboardScores');

// Game state variables
let radius = 0; // Distance from dot to starting click point (determines circle size)
let circle = null; // Reference to the target circle element
let userPath = null; // Container for the user's drawn path
let percentage = null; // Display element showing accuracy percentage
let hitboxCircle = null; // Starting point circle that user must return to
let innerCircle = null; // Visual circle around dot showing the "perfect" zone
let timer = null; // Timer display element
let timerInterval = null; // Interval reference for countdown timer
let timeLeft = 7; // Remaining seconds on the timer
let dotX, dotY; // Center coordinates of the dot
let isDrawing = false; // Flag to track if user is currently drawing
let pathPoints = []; // Array storing all mouse positions during drawing
let startX, startY; // Coordinates where user started drawing
let hasLeftHitbox = false; // Flag to ensure user leaves starting area before completing
let hasBeenRight = false; // Track if user has drawn to the right of the dot
let hasBeenLeft = false; // Track if user has drawn to the left of the dot
let hasBeenAbove = false; // Track if user has drawn above the dot
let hasBeenBelow = false; // Track if user has drawn below the dot

// Leaderboard functions
function loadScores() {
  // Retrieve scores from browser's localStorage
  const saved = localStorage.getItem('circleScores');
  return saved ? JSON.parse(saved) : [];
}

function saveScore(score) {
  // Add new score, sort descending, and keep only top 10
  let scores = loadScores();
  scores.push(score);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 10);
  localStorage.setItem('circleScores', JSON.stringify(scores));
  updateLeaderboard();
}

function updateLeaderboard() {
  // Render the leaderboard with current top 10 scores
  const scores = loadScores();
  leaderboardScores.innerHTML = scores.map((score, i) => 
    `<div>${i + 1}. ${score}%</div>`
  ).join('');
}

// Initialize leaderboard on page load
updateLeaderboard();

// Helper function to update percentage color based on score
function updatePercentageColor(element, score) {
  let color;
  
  if (score >= 80) {
    // Green to yellow fade (100% = pure green, 80% = pure yellow)
    const ratio = (score - 80) / 20; // 0 at 80%, 1 at 100%
    const red = Math.round(255 * (1 - ratio));
    const green = 255;
    const blue = 0;
    color = `rgb(${red}, ${green}, ${blue})`;
  } else if (score >= 60) {
    // Yellow to red fade (80% = pure yellow, 60% = pure red)
    const ratio = (score - 60) / 20; // 0 at 60%, 1 at 80%
    const red = 255;
    const green = Math.round(255 * ratio);
    const blue = 0;
    color = `rgb(${red}, ${green}, ${blue})`;
  } else {
    // Below 60% stays red
    color = 'rgb(255, 0, 0)';
  }
  
  element.style.color = color;
}

// Debug mode toggle - shows/hides helper elements
debugToggle.addEventListener('change', () => {
  if (debugToggle.checked) {
    // Show all debug elements (guide lines, circles, timer)
    verticalLine.classList.add('debug-visible');
    horizontalLine.classList.add('debug-visible');
    if (circle) circle.classList.add('debug-visible');
    if (hitboxCircle) hitboxCircle.classList.add('debug-visible');
    if (innerCircle) innerCircle.classList.add('debug-visible');
    if (timer) timer.classList.add('debug-visible');
  } else {
    // Hide all debug elements
    verticalLine.classList.remove('debug-visible');
    horizontalLine.classList.remove('debug-visible');
    if (circle) circle.classList.remove('debug-visible');
    if (hitboxCircle) hitboxCircle.classList.remove('debug-visible');
    if (innerCircle) innerCircle.classList.remove('debug-visible');
    if (timer) timer.classList.remove('debug-visible');
  }
});

// Mouse down starts the circle drawing challenge
body.addEventListener('mousedown', (e) => {
  // Get dot center position (needed to calculate radius and accuracy)
  const dotRect = dot.getBoundingClientRect();
  dotX = dotRect.left + dotRect.width / 2;
  dotY = dotRect.top + dotRect.height / 2;
  
  // Calculate distance from mousedown to dot (this becomes the circle radius)
  const dx = e.clientX - dotX;
  const dy = e.clientY - dotY;
  radius = Math.sqrt(dx * dx + dy * dy);
  
  // Check if too close to dot (minimum radius requirement)
  if (radius < 100) {
    // Remove old elements if exist
    if (circle) circle.remove();
    if (userPath) userPath.remove();
    if (percentage) percentage.remove();
    if (hitboxCircle) hitboxCircle.remove();
    if (innerCircle) innerCircle.remove();
    if (timer) timer.remove();
    if (timerInterval) clearInterval(timerInterval);
    
    // Show "too close to dot" message
    percentage = document.createElement('div');
    percentage.className = 'percentage';
    percentage.textContent = 'Too close to dot';
    percentage.style.left = dotX + 'px';
    percentage.style.top = (dotY - 80) + 'px';
    body.appendChild(percentage);
    
    return;
  }
  
  // Clean up any existing game elements from previous attempts
  if (circle) circle.remove();
  if (userPath) userPath.remove();
  if (percentage) percentage.remove();
  if (hitboxCircle) hitboxCircle.remove();
  if (innerCircle) innerCircle.remove();
  if (timer) timer.remove();
  if (timerInterval) clearInterval(timerInterval);
  
  // Reset game state for new attempt
  pathPoints = [];
  startX = e.clientX;
  startY = e.clientY;
  hasLeftHitbox = false;
  hasBeenRight = false;
  hasBeenLeft = false;
  hasBeenAbove = false;
  hasBeenBelow = false;
  timeLeft = 7;
  
  // Create target circle (the "perfect" circle to trace)
  circle = document.createElement('div');
  circle.className = 'circle';
  if (debugToggle.checked) circle.classList.add('debug-visible');
  circle.style.width = radius * 2 + 'px';
  circle.style.height = radius * 2 + 'px';
  circle.style.left = dotX + 'px';
  circle.style.top = dotY + 'px';
  body.appendChild(circle);
  
  // Create hitbox circle (starting/ending area user must return to)
  hitboxCircle = document.createElement('div');
  hitboxCircle.className = 'hitbox-circle';
  if (debugToggle.checked) hitboxCircle.classList.add('debug-visible');
  hitboxCircle.style.width = '60px';
  hitboxCircle.style.height = '60px';
  hitboxCircle.style.left = startX + 'px';
  hitboxCircle.style.top = startY + 'px';
  body.appendChild(hitboxCircle);
  
  // Create inner circle (visual guide around the dot)
  innerCircle = document.createElement('div');
  innerCircle.className = 'inner-circle';
  if (debugToggle.checked) innerCircle.classList.add('debug-visible');
  innerCircle.style.width = '200px';
  innerCircle.style.height = '200px';
  innerCircle.style.left = dotX + 'px';
  innerCircle.style.top = dotY + 'px';
  body.appendChild(innerCircle);
  
  // Create percentage display (shows accuracy in real-time)
  percentage = document.createElement('div');
  percentage.className = 'percentage';
  percentage.textContent = '100%';
  percentage.style.color = 'rgb(0, 255, 0)'; // Start at green (100%)
  percentage.style.left = dotX + 'px';
  percentage.style.top = (dotY - radius - 80) + 'px';
  body.appendChild(percentage);
  
  // Create user drawing path (container for all path segments)
  userPath = document.createElement('div');
  userPath.className = 'user-path';
  userPath.style.left = e.clientX + 'px';
  userPath.style.top = e.clientY + 'px';
  body.appendChild(userPath);
  
  // Create timer (countdown display)
  timer = document.createElement('div');
  timer.className = 'timer';
  if (debugToggle.checked) timer.classList.add('debug-visible');
  timer.textContent = '7.0s';
  timer.style.left = dotX + 'px';
  timer.style.top = (dotY + radius + 20) + 'px';
  body.appendChild(timer);
  
  // Start timer countdown (decrements every 0.1 seconds)
  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isDrawing = false;
      percentage.textContent = 'Too slow!';
      timer.textContent = '0.0s';
    } else {
      timer.textContent = timeLeft.toFixed(1) + 's';
    }
  }, 100);
  
  isDrawing = true;
});

// Mouse move tracks the user's drawing path
body.addEventListener('mousemove', (e) => {
  if (!isDrawing || !userPath) return;
  
  // Create a small circle at current mouse position (visual trail)
  const pathSegment = document.createElement('div');
  pathSegment.className = 'path-segment';
  pathSegment.style.left = e.clientX + 'px';
  pathSegment.style.top = e.clientY + 'px';
  userPath.appendChild(pathSegment);
  
  // Track point and calculate accuracy
  pathPoints.push({ x: e.clientX, y: e.clientY });
  
  // Check distance from starting point
  const distFromStart = Math.sqrt((e.clientX - startX) ** 2 + (e.clientY - startY) ** 2);
  const hitboxRadius = 30; // Half of hitbox circle's 60px diameter
  
  // Check if left hitbox (user must leave before returning to complete)
  if (distFromStart > hitboxRadius) {
    hasLeftHitbox = true;
  }
  
  // Check quadrant tracking (ensures user draws around all sides of dot)
  if (e.clientX > dotX) hasBeenRight = true;
  if (e.clientX < dotX) hasBeenLeft = true;
  if (e.clientY < dotY) hasBeenAbove = true;
  if (e.clientY > dotY) hasBeenBelow = true;
  
  // Check if completed circle (returned to hitbox after leaving)
  if (hasLeftHitbox && distFromStart <= hitboxRadius) {
    // Check if all quadrants were visited (ensures full circle)
    if (hasBeenRight && hasBeenLeft && hasBeenAbove && hasBeenBelow) {
      isDrawing = false;
      if (timerInterval) clearInterval(timerInterval);
      const currentScore = parseInt(percentage.textContent);

      // Only save score when debug mode is OFF to avoid cheating
      if (!debugToggle.checked) {
        saveScore(currentScore);
      }
      percentage.textContent = 'Complete! ' + percentage.textContent;

      if (debugToggle.checked) {
        percentage.textContent += ' (debug: not saved to leaderboard)';
      }
    } else {
      // User returned to start without visiting all quadrants
      isDrawing = false;
      if (timerInterval) clearInterval(timerInterval);
      percentage.textContent = 'Draw the circle around the dot!';
    }
    return;
  }
  
  // Calculate accuracy based on deviation from perfect circle
  if (pathPoints.length > 1) {
    let totalError = 0;
    // Check each point's distance from the ideal circle
    for (let point of pathPoints) {
      const dx = point.x - dotX;
      const dy = point.y - dotY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const error = Math.abs(distance - radius); // How far off from perfect circle
      totalError += error;
    }
    
    // Calculate average error and convert to percentage score
    const avgError = totalError / pathPoints.length;
    const maxAllowedError = radius * 0.5; // Error threshold (50% of radius)
    const accuracy = Math.max(0, 100 - (avgError / maxAllowedError) * 100);
    const roundedAccuracy = Math.round(accuracy);
    percentage.textContent = roundedAccuracy + '%';
    
    // Update color based on accuracy: green (100%) -> yellow (80%) -> red (60%)
    updatePercentageColor(percentage, roundedAccuracy);
  }
});

// Mouse up stops drawing
body.addEventListener('mouseup', () => {
  isDrawing = false;
});