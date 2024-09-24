const cursor = document.getElementById("cursor");
const amount = 20;
const sineDots = Math.floor(amount * 0.3);
const width = 26;
const idleTimeout = 150;
let lastFrame = 0;
let mousePosition = { x: 0, y: 0 };
let dots = [];
let timeoutID;
let idle = false;

class Dot {
  constructor(index = 0) {
    this.index = index;
    this.anglespeed = 0.05;
    this.scale = 1 - 0.05 * index;
    this.range = width / 2 - width / 2 * this.scale + 2;
    this.x = 0;
    this.y = 0;
    this.element = document.createElement("span");
    TweenMax.set(this.element, { scale: this.scale, x: this.x, y: this.y });
    cursor.appendChild(this.element);
  }

  lock() {
    this.lockX = this.x;
    this.lockY = this.y;
    this.angleX = Math.random() * Math.PI * 2;
    this.angleY = Math.random() * Math.PI * 2;
  }

  draw() {
    if (!idle || this.index <= sineDots) {
      TweenMax.to(this.element, 0.2, { x: this.x, y: this.y, ease: Power4.easeOut });
    } else {
      this.angleX += this.anglespeed;
      this.angleY += this.anglespeed;
      this.y = this.lockY + Math.sin(this.angleY) * this.range;
      this.x = this.lockX + Math.sin(this.angleX) * this.range;
      TweenMax.to(this.element, 0.2, { x: this.x, y: this.y, ease: Power4.easeOut });
    }
  }
}

function init() {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove);
  lastFrame = performance.now();
  buildDots();
  requestAnimationFrame(render);
}

function startIdleTimer() {
  timeoutID = setTimeout(goInactive, idleTimeout);
  idle = false;
}

function resetIdleTimer() {
  clearTimeout(timeoutID);
  startIdleTimer();
}

function goInactive() {
  idle = true;
  dots.forEach(dot => dot.lock());
}

function buildDots() {
  for (let i = 0; i < amount; i++) {
    dots.push(new Dot(i));
  }
}

function onMouseMove(event) {
  mousePosition.x = event.clientX - width / 2;
  mousePosition.y = event.clientY - width / 2;
  resetIdleTimer();
}

function onTouchMove(event) {
  mousePosition.x = event.touches[0].clientX - width / 2;
  mousePosition.y = event.touches[0].clientY - width / 2;
  resetIdleTimer();
}

function render(timestamp) {
  const delta = timestamp - lastFrame;
  positionCursor(delta);
  lastFrame = timestamp;
  requestAnimationFrame(render);
}

function positionCursor() {
  let x = mousePosition.x;
  let y = mousePosition.y;
  dots.forEach((dot, index) => {
    const nextDot = dots[index + 1] || dots[0];
    dot.x = x;
    dot.y = y;
    dot.draw();
    if (!idle || index <= sineDots) {
      x += (nextDot.x - dot.x) * 0.4;
      y += (nextDot.y - dot.y) * 0.4;
    }
  });
}

init();

document.addEventListener('click', event => {
  const wave = document.createElement('div');
  wave.classList.add('wave-effect');
  const x = event.clientX;
  const y = event.clientY;
  wave.style.left = `${x - 10}px`;
  wave.style.top = `${y - 10}px`;  
  document.body.appendChild(wave);
  setTimeout(() => wave.remove(), 1000);
});

let audio = document.getElementById('audio');
let music = document.getElementById('music');

audio.onclick = function (){
  if(music.paused){
    music.play();
  }
  else{
    music.pause();
  }
}

document.addEventListener('click', () => {
  const clickkk = new Audio('music/click.mp3');
  clickkk.currentTime = 0;
  clickkk.play();
});

