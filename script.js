const dot = document.querySelector('.dot');
const body = document.body;

let radius = 0;
let circle = null;
let userPath = null;
let dotX, dotY;
let isDrawing = false;

body.addEventListener('mousedown', (e) => {
  // Get dot center position
  const dotRect = dot.getBoundingClientRect();
  dotX = dotRect.left + dotRect.width / 2;
  dotY = dotRect.top + dotRect.height / 2;
  
  // Calculate distance from mousedown to dot
  const dx = e.clientX - dotX;
  const dy = e.clientY - dotY;
  radius = Math.sqrt(dx * dx + dy * dy);
  
  // Remove old elements if exist
  if (circle) circle.remove();
  if (userPath) userPath.remove();
  
  // Create target circle
  circle = document.createElement('div');
  circle.className = 'circle';
  circle.style.width = radius * 2 + 'px';
  circle.style.height = radius * 2 + 'px';
  circle.style.left = dotX + 'px';
  circle.style.top = dotY + 'px';
  body.appendChild(circle);
  
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
});

body.addEventListener('mouseup', () => {
  isDrawing = false;
});