// ── HERO BG ZOOM
(function(){
  const img = new Image();
  img.src = 'https://acarakami.com/wp-content/uploads/2025/10/WILL8897.jpg';
  img.onload = () => document.getElementById('hero').classList.add('loaded');
})();

// ── FALLING PETALS
(function(){
  const c = document.getElementById('petals'), ctx = c.getContext('2d');
  let W, H;
  function resize(){ W = c.width = innerWidth; H = c.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const petals = [];
  for(let i = 0; i < 28; i++){
    petals.push({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      vx: (Math.random() - .5) * 0.12, vy: Math.random() * 0.08 + 0.04,
      rot: Math.random() * Math.PI * 2, vr: (Math.random() - .5) * 0.015,
      a: Math.random() * 0.5 + 0.1,
      gold: Math.random() > 0.5,
      sway: Math.random() * 0.3 + 0.1, swayT: Math.random() * 100
    });
  }
  (function draw(){
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      p.swayT += 0.012;
      p.x += p.vx + Math.sin(p.swayT) * p.sway;
      p.y += p.vy; p.rot += p.vr;
      if(p.y > 102){ p.y = -2; p.x = Math.random() * 100; }
      if(p.x < -2) p.x = 102; if(p.x > 102) p.x = -2;
      const px = p.x / 100 * W, py = p.y / 100 * H;
      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.translate(px, py); ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      ctx.fillStyle = p.gold ? 'rgba(201,169,110,0.7)' : 'rgba(196,137,122,0.6)';
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  })();
})();

// ── CURSOR GLOW
(function(){
  const g = document.getElementById('cursor-glow');
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; g.style.opacity = '1'; });
  document.addEventListener('mouseleave', () => g.style.opacity = '0');
  (function lerp(){
    cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08;
    g.style.left = cx + 'px'; g.style.top = cy + 'px';
    requestAnimationFrame(lerp);
  })();
})();

// ── HERO PARALLAX
(function(){
  const bg = document.getElementById('hero-bg');
  if(!bg) return;
  window.addEventListener('scroll', () => {
    bg.style.transform = `scale(1) translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
})();

// ── PARTICLES
(function(){
  const c = document.getElementById('particles'), ctx = c.getContext('2d');
  let W, H, pts = [];
  function resize(){ W = c.width = innerWidth; H = c.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  for(let i = 0; i < 100; i++) pts.push({
    x: Math.random() * 100, y: Math.random() * 100,
    vx: (Math.random() - .5) * 0.06, vy: (Math.random() - .5) * 0.06,
    r: Math.random() * 1.4 + 0.2, a: Math.random(),
    da: 0.002 + Math.random() * 0.005, gold: Math.random() > 0.45
  });
  (function draw(){
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = 100; if(p.x > 100) p.x = 0;
      if(p.y < 0) p.y = 100; if(p.y > 100) p.y = 0;
      p.a += p.da; if(p.a > 1 || p.a < 0) p.da *= -1;
      ctx.save();
      ctx.globalAlpha = p.a * 0.35;
      ctx.beginPath();
      ctx.arc(p.x / 100 * W, p.y / 100 * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold ? '#C9A96E' : '#C4897A';
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  })();
})();

// ── ENVELOPE
function openEnvelope(){
  document.getElementById('envEl').classList.add('open');
  setTimeout(() => document.getElementById('env-screen').classList.add('out'), 900);
  setTimeout(() => {
    const a = document.getElementById('bgMusic');
    a.volume = 0;
    a.play().then(() => {
      playing = true;
      document.getElementById('musicBtn').classList.add('playing');
      document.getElementById('mIcon').textContent = '■';
      showLabel();
      let v = 0;
      const t = setInterval(() => { v = Math.min(v + 0.02, 0.55); a.volume = v; if(v >= 0.55) clearInterval(t); }, 120);
    }).catch(() => {});
  }, 1000);
}

// ── MUSIC
let playing = false, lt;
const mBtn = document.getElementById('musicBtn');
const mLabel = document.getElementById('musicLabel');

function showLabel(){
  mLabel.classList.add('show');
  clearTimeout(lt);
  lt = setTimeout(() => mLabel.classList.remove('show'), 2500);
}

function toggleMusic(){
  const a = document.getElementById('bgMusic');
  if(playing){
    a.pause();
    mBtn.classList.remove('playing');
    document.getElementById('mIcon').textContent = '♪';
    playing = false;
  } else {
    a.play().catch(() => {});
    mBtn.classList.add('playing');
    document.getElementById('mIcon').textContent = '■';
    playing = true;
  }
  showLabel();
}

// ── COUNTDOWN
const tgt = new Date('2025-12-20T10:00:00+07:00');
const prev = {};

function animFlip(id, val){
  const el = document.getElementById(id);
  if(!el || prev[id] === val) return;
  prev[id] = val;
  el.classList.add('flip');
  setTimeout(() => { el.textContent = val; el.classList.remove('flip'); }, 150);
}

function tick(){
  const diff = tgt - new Date();
  if(diff <= 0){
    document.getElementById('cdEl').style.display = 'none';
    document.getElementById('cdDone').style.display = 'block';
    return;
  }
  const d = String(Math.floor(diff / 86400000)).padStart(2, '0');
  const h = String(Math.floor(diff % 86400000 / 3600000)).padStart(2, '0');
  const m = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0');
  const s = String(Math.floor(diff % 60000 / 1000)).padStart(2, '0');
  animFlip('cD', d); animFlip('cH', h); animFlip('cM', m); animFlip('cS', s);
}
tick(); setInterval(tick, 1000);

// ── SCROLL REVEAL
const ro = new IntersectionObserver(es => {
  es.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => ro.observe(el));

// ── RSVP
function submitRSVP(){
  if(!document.getElementById('rName').value.trim() || !document.getElementById('rStatus').value){
    alert('Harap isi nama dan konfirmasi kehadiran.'); return;
  }
  document.getElementById('rsvp-ok').style.display = 'block';
  ['rName', 'rEmail', 'rStatus'].forEach(id => document.getElementById(id).value = '');
}

// ── WISHES
const wishes = [];
function submitWish(){
  const n = document.getElementById('wName').value.trim();
  const m = document.getElementById('wMsg').value.trim();
  if(!n || !m){ alert('Harap isi nama dan ucapan.'); return; }
  wishes.unshift({ n, m });
  document.getElementById('wList').innerHTML =
    wishes.map(w => `<div class="wcard"><p class="w-name">${w.n}</p><p class="w-msg">${w.m}</p></div>`).join('') +
    `<div class="wcard"><p class="w-name">Keluarga Besar</p><p class="w-msg">Selamat menempuh hidup baru. Semoga menjadi keluarga yang bahagia, rukun, dan selalu dalam lindungan Tuhan. 🙏</p></div>`;
  document.getElementById('wName').value = '';
  document.getElementById('wMsg').value = '';
}
