const dot = document.querySelector('.dot');
const body = document.body;
const debugToggle = document.getElementById('debugToggle');
const verticalLine = document.querySelector('.vertical-line');
const horizontalLine = document.querySelector('.horizontal-line');

let radius = 0;
let circle = null;
let userPath = null;
let percentage = null;
let hitboxCircle = null;
let innerCircle = null;
let timer = null;
let timerInterval = null;
let timeLeft = 7;
let dotX, dotY;
let isDrawing = false;
let pathPoints = [];
let startX, startY;
let hasLeftHitbox = false;
let hasBeenRight = false;
let hasBeenLeft = false;
let hasBeenAbove = false;
let hasBeenBelow = false;

debugToggle.addEventListener('change', () => {
  if (debugToggle.checked) {
    verticalLine.classList.add('debug-visible');
    horizontalLine.classList.add('debug-visible');
    if (circle) circle.classList.add('debug-visible');
    if (hitboxCircle) hitboxCircle.classList.add('debug-visible');
    if (innerCircle) innerCircle.classList.add('debug-visible');
    if (timer) timer.classList.add('debug-visible');
  } else {
    verticalLine.classList.remove('debug-visible');
    horizontalLine.classList.remove('debug-visible');
    if (circle) circle.classList.remove('debug-visible');
    if (hitboxCircle) hitboxCircle.classList.remove('debug-visible');
    if (innerCircle) innerCircle.classList.remove('debug-visible');
    if (timer) timer.classList.remove('debug-visible');
  }
});

body.addEventListener('mousedown', (e) => {
  // Get dot center position
  const dotRect = dot.getBoundingClientRect();
  dotX = dotRect.left + dotRect.width / 2;
  dotY = dotRect.top + dotRect.height / 2;
  
  // Calculate distance from mousedown to dot
  const dx = e.clientX - dotX;
  const dy = e.clientY - dotY;
  radius = Math.sqrt(dx * dx + dy * dy);
  
  // Check if too close to dot
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
    percentage.style.top = (dotY - 40) + 'px';
    body.appendChild(percentage);
    
    return;
  }
  
  // Remove old elements if exist
  if (circle) circle.remove();
  if (userPath) userPath.remove();
  if (percentage) percentage.remove();
  if (hitboxCircle) hitboxCircle.remove();
  if (innerCircle) innerCircle.remove();
  if (timer) timer.remove();
  if (timerInterval) clearInterval(timerInterval);
  
  pathPoints = [];
  startX = e.clientX;
  startY = e.clientY;
  hasLeftHitbox = false;
  hasBeenRight = false;
  hasBeenLeft = false;
  hasBeenAbove = false;
  hasBeenBelow = false;
  timeLeft = 7;
  
  // Create target circle
  circle = document.createElement('div');
  circle.className = 'circle';
  if (debugToggle.checked) circle.classList.add('debug-visible');
  circle.style.width = radius * 2 + 'px';
  circle.style.height = radius * 2 + 'px';
  circle.style.left = dotX + 'px';
  circle.style.top = dotY + 'px';
  body.appendChild(circle);
  
  // Create hitbox circle
  hitboxCircle = document.createElement('div');
  hitboxCircle.className = 'hitbox-circle';
  if (debugToggle.checked) hitboxCircle.classList.add('debug-visible');
  hitboxCircle.style.width = '40px';
  hitboxCircle.style.height = '40px';
  hitboxCircle.style.left = startX + 'px';
  hitboxCircle.style.top = startY + 'px';
  body.appendChild(hitboxCircle);
  
  // Create inner circle
  innerCircle = document.createElement('div');
  innerCircle.className = 'inner-circle';
  if (debugToggle.checked) innerCircle.classList.add('debug-visible');
  innerCircle.style.width = '200px';
  innerCircle.style.height = '200px';
  innerCircle.style.left = dotX + 'px';
  innerCircle.style.top = dotY + 'px';
  body.appendChild(innerCircle);
  
  // Create percentage display
  percentage = document.createElement('div');
  percentage.className = 'percentage';
  percentage.textContent = '100%';
  percentage.style.left = dotX + 'px';
  percentage.style.top = (dotY - radius - 40) + 'px';
  body.appendChild(percentage);
  
  // Create user drawing path
  userPath = document.createElement('div');
  userPath.className = 'user-path';
  userPath.style.left = e.clientX + 'px';
  userPath.style.top = e.clientY + 'px';
  body.appendChild(userPath);
  
  // Create timer
  timer = document.createElement('div');
  timer.className = 'timer';
  if (debugToggle.checked) timer.classList.add('debug-visible');
  timer.textContent = '7.0s';
  timer.style.left = dotX + 'px';
  timer.style.top = (dotY + radius + 20) + 'px';
  body.appendChild(timer);
  
  // Start timer countdown
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

body.addEventListener('mousemove', (e) => {
  if (!isDrawing || !userPath) return;
  
  const pathSegment = document.createElement('div');
  pathSegment.className = 'path-segment';
  pathSegment.style.left = e.clientX + 'px';
  pathSegment.style.top = e.clientY + 'px';
  userPath.appendChild(pathSegment);
  
  // Track point and calculate accuracy
  pathPoints.push({ x: e.clientX, y: e.clientY });
  
  // Check distance from starting point
  const distFromStart = Math.sqrt((e.clientX - startX) ** 2 + (e.clientY - startY) ** 2);
  const hitboxRadius = 20;
  
  // Check if left hitbox
  if (distFromStart > hitboxRadius) {
    hasLeftHitbox = true;
  }
  
  // Check quadrant tracking
  if (e.clientX > dotX) hasBeenRight = true;
  if (e.clientX < dotX) hasBeenLeft = true;
  if (e.clientY < dotY) hasBeenAbove = true;
  if (e.clientY > dotY) hasBeenBelow = true;
  
  // Check if completed circle (returned to hitbox after leaving)
  if (hasLeftHitbox && distFromStart <= hitboxRadius) {
    // Check if all quadrants were visited
    if (hasBeenRight && hasBeenLeft && hasBeenAbove && hasBeenBelow) {
      isDrawing = false;
      if (timerInterval) clearInterval(timerInterval);
      percentage.textContent = 'Complete! ' + percentage.textContent;
    }
    return;
  }
  
  if (pathPoints.length > 1) {
    let totalError = 0;
    for (let point of pathPoints) {
      const dx = point.x - dotX;
      const dy = point.y - dotY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const error = Math.abs(distance - radius);
      totalError += error;
    }
    
    const avgError = totalError / pathPoints.length;
    const maxAllowedError = radius * 0.5;
    const accuracy = Math.max(0, 100 - (avgError / maxAllowedError) * 100);
    percentage.textContent = Math.round(accuracy) + '%';
  }
});

body.addEventListener('mouseup', () => {
  isDrawing = false;
});