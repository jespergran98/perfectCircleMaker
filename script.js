const dot = document.querySelector('.dot');
const body = document.body;

let radius = 0;
let circle = null;

body.addEventListener('click', (e) => {
  // Get dot center position
  const dotRect = dot.getBoundingClientRect();
  const dotX = dotRect.left + dotRect.width / 2;
  const dotY = dotRect.top + dotRect.height / 2;
  
  // Calculate distance from click to dot
  const dx = e.clientX - dotX;
  const dy = e.clientY - dotY;
  radius = Math.sqrt(dx * dx + dy * dy);
  
  // Remove old circle if exists
  if (circle) circle.remove();
  
  // Create new circle
  circle = document.createElement('div');
  circle.className = 'circle';
  circle.style.width = radius * 2 + 'px';
  circle.style.height = radius * 2 + 'px';
  circle.style.left = dotX + 'px';
  circle.style.top = dotY + 'px';
  body.appendChild(circle);
});