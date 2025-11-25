const dot = document.querySelector('.dot');
const body = document.body;

let radius = 0;
let circle = null;
let userPath = null;
let percentage = null;
let dotX, dotY;
let isDrawing = false;
let pathPoints = [];
let startX, startY;
let hasLeftHitbox = false;

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
  if (radius < 30) {
    // Remove old elements if exist
    if (circle) circle.remove();
    if (userPath) userPath.remove();
    if (percentage) percentage.remove();
    
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
  
  pathPoints = [];
  startX = e.clientX;
  startY = e.clientY;
  hasLeftHitbox = false;
  
  // Create target circle
  circle = document.createElement('div');
  circle.className = 'circle';
  circle.style.width = radius * 2 + 'px';
  circle.style.height = radius * 2 + 'px';
  circle.style.left = dotX + 'px';
  circle.style.top = dotY + 'px';
  body.appendChild(circle);
  
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
  
  // Check if completed circle (returned to hitbox after leaving)
  if (hasLeftHitbox && distFromStart <= hitboxRadius) {
    isDrawing = false;
    percentage.textContent = 'Complete! ' + percentage.textContent;
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
    const maxAllowedError = radius * 0.15;
    const accuracy = Math.max(0, 100 - (avgError / maxAllowedError) * 100);
    percentage.textContent = Math.round(accuracy) + '%';
  }
});

body.addEventListener('mouseup', () => {
  isDrawing = false;
});