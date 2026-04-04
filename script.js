// ── CUSTOM CURSOR ──
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;

if (cursor && cursorRing) {
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx - 6 + "px";
    cursor.style.top = my - 6 + "px";
  });

  function animateCursorRing() {
    rx += (mx - rx - 18) * 0.12;
    ry += (my - ry - 18) * 0.12;
    cursorRing.style.left = rx + "px";
    cursorRing.style.top = ry + "px";
    requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  document.querySelectorAll("button, a, .nav-box").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorRing.style.transform = "scale(2)";
      cursorRing.style.borderColor = "var(--gold)";
    });
    el.addEventListener("mouseleave", () => {
      cursorRing.style.transform = "scale(1)";
      cursorRing.style.borderColor = "var(--gold)";
    });
  });
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });
}

// ── FORCE BACK BUTTON TO HOME ──
document.querySelectorAll(".back-btn").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.assign("index.html");
  });
});

// ── LIGHTNING PARTICLES ──
const canvas = document.getElementById("particles-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.5 ? "#4fc3f7" : "#ffd700",
    });
  }
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ── AWAKEN SEQUENCE ──
let awakened = false;
const vid1 = document.getElementById("vid1");
const vid2 = document.getElementById("vid2");
const flash = document.getElementById("flash");
const awakenWrap = document.getElementById("awakenWrap");
const navBoxes = document.getElementById("nav-boxes");
const navLinks = document.getElementById("navLinks");
const hero = document.getElementById("hero");

function triggerAwaken() {
  if (awakened || (!vid1 && !vid2)) return;
  awakened = true;

  if (awakenWrap) awakenWrap.classList.add("hidden");

  if (hero) {
    let shakeCount = 0;
    const shakeInterval = setInterval(() => {
      const dx = (Math.random() - 0.5) * 10;
      const dy = (Math.random() - 0.5) * 10;
      hero.style.transform = `translate(${dx}px, ${dy}px)`;
      shakeCount++;
      if (shakeCount > 8) {
        clearInterval(shakeInterval);
        hero.style.transform = "translate(0,0)";
      }
    }, 60);
  }

  setTimeout(() => {
    if (vid1) vid1.style.opacity = "0";
    if (vid2) {
      vid2.style.opacity = "1";
      vid2.currentTime = 0;
      vid2.play();
    }
  }, 500);

  if (vid2) vid2.addEventListener("timeupdate", handleVid2Progress);
}

let explosionFired = false;
function handleVid2Progress() {
  const remaining = vid2.duration - vid2.currentTime;
  if (!explosionFired && remaining < 2.5 && remaining > 0) {
    explosionFired = true;
    fireExplosion();
  }
}

function fireExplosion() {
  if (flash) {
    flash.style.opacity = "1";
    setTimeout(() => {
      flash.style.opacity = "0";
    }, 120);
  }

  if (hero) {
    let sc = 0;
    const si = setInterval(() => {
      const dx = (Math.random() - 0.5) * 30;
      const dy = (Math.random() - 0.5) * 30;
      hero.style.transform = `translate(${dx}px, ${dy}px)`;
      sc++;
      if (sc > 14) {
        clearInterval(si);
        hero.style.transform = "translate(0,0)";
      }
    }, 40);
  }

  for (let i = 0; i < 4; i++) {
    setTimeout(() => createShockwave(), i * 140);
  }

  setTimeout(() => createParticleBurst(), 150);

  setTimeout(() => {
    if (navBoxes) {
      navBoxes.classList.add("revealed");
      document.querySelectorAll(".nav-box").forEach((box, i) => {
        setTimeout(() => box.classList.add("pop"), i * 150);
      });
    }
    if (navLinks) {
      navLinks.classList.add("visible");
    }
  }, 900);
}

function createShockwave() {
  if (!hero) return;
  const sw = document.createElement("div");
  sw.className = "shockwave";
  hero.appendChild(sw);
  sw.style.borderColor = Math.random() > 0.5 ? "#ffd700" : "#4fc3f7";
  sw.style.transition = "all 0.8s ease-out";
  requestAnimationFrame(() => {
    sw.style.transform = "translate(-50%, -50%) scale(100)";
    sw.style.opacity = "0";
  });
  setTimeout(() => sw.remove(), 900);
}

function createParticleBurst() {
  if (!hero) return;
  const colors = ["#ffd700", "#ff6b35", "#ffffff", "#4fc3f7", "#ff4444"];
  for (let i = 0; i < 55; i++) {
    const p = document.createElement("div");
    p.style.cssText = `
      position:absolute;
      left:50%;top:70%;
      width:${Math.random() * 6 + 3}px;
      height:${Math.random() * 6 + 3}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:50%;
      pointer-events:none;
      z-index:8;
      transition:all ${0.6 + Math.random() * 0.6}s ease-out;
    `;
    hero.appendChild(p);
    const angle = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 280;
    requestAnimationFrame(() => {
      p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      p.style.opacity = "0";
    });
    setTimeout(() => p.remove(), 1400);
  }
}
