// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Hero rain animation ----------
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');
let drops = [];
let rafId = null;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function sizeCanvas() {
  const hero = document.querySelector('.hero');
  canvas.width = hero.clientWidth;
  canvas.height = hero.clientHeight;
}

function initDrops() {
  drops = [];
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  for (let i = 0; i < count; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 10 + Math.random() * 20,
      speed: 6 + Math.random() * 9,
      drift: 0.6 + Math.random() * 0.6,
      opacity: 0.15 + Math.random() * 0.35
    });
  }
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  for (const d of drops) {
    ctx.strokeStyle = `rgba(220,225,235,${d.opacity})`;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - d.drift * 3, d.y + d.len);
    ctx.stroke();
    d.x -= d.drift;
    d.y += d.speed;
    if (d.y > canvas.height) {
      d.y = -d.len;
      d.x = Math.random() * canvas.width;
    }
  }
  rafId = requestAnimationFrame(drawRain);
}

sizeCanvas();
initDrops();

if (!prefersReducedMotion) {
  drawRain();
} else {
  // draw a single static frame instead of animating
  drawRain();
  cancelAnimationFrame(rafId);
}

window.addEventListener('resize', () => {
  sizeCanvas();
  initDrops();
});
