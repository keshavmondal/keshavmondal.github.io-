/* =========================================================
   PORTFOLIO INTERACTIVITY
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Toast helper ---------- */
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();

/* ---------- Theme toggle (remembers choice) ---------- */
const themeBtn = $("#themeToggle");
function setTheme(light) {
  document.body.classList.toggle("light", light);
  themeBtn.textContent = light ? "☀️" : "🌙";
  try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved === "light");
themeBtn.addEventListener("click", () => setTheme(!document.body.classList.contains("light")));

/* ---------- Mobile menu ---------- */
const navLinks = $("#navLinks");
$("#menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
$$("#navLinks a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

/* ---------- Typing effect ---------- */
const roles = ["CSE Student", "Tech Enthusiast", "Future AI & ML Engineer"];
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  $("#typing").textContent = word.slice(0, c);
  if (!deleting && c < word.length) c++;
  else if (deleting && c > 0) c--;
  else if (!deleting) { deleting = true; return setTimeout(type, 1300); }
  else { deleting = false; r = (r + 1) % roles.length; }
  setTimeout(type, deleting ? 50 : 110);
}
type();

/* ---------- Scroll: progress bar, navbar, active link, back-to-top ---------- */
const sections = $$("section[id]");
function onScroll() {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  $("#progress").style.width = (y / h) * 100 + "%";
  $("#navbar").classList.toggle("scrolled", y > 50);
  $("#toTop").classList.toggle("show", y > 500);

  let current = "home";
  sections.forEach(s => { if (y >= s.offsetTop - 140) current = s.id; });
  // "Skills" section highlights the Skills link, etc.
  $$("#navLinks a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- Reveal on scroll + animated bars/counters ---------- */
function animateCount(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    n += step;
    if (n >= target) { n = target; clearInterval(timer); }
    el.textContent = n;
  }, 30);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("visible");
    $$(".fill", el).forEach(f => (f.style.width = f.dataset.width + "%"));
    $$("[data-count]", el).forEach(animateCount);
    io.unobserve(el);
  });
}, { threshold: 0.15 });
$$(".reveal").forEach(el => io.observe(el));

/* ---------- Academics tabs ---------- */
$$(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach(t => t.classList.remove("active"));
    $$(".tab-content").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    $("#" + tab.dataset.tab).classList.add("active");
  });
});

/* ---------- Dream randomiser ---------- */
const dreams = [
  "To become a software engineer who builds technology that solves real problems — and one day start my own tech company.",
  "To work on Artificial Intelligence that helps students learn better, no matter where they live.",
  "To build apps that make life easier for people in my hometown and beyond.",
  "To mentor juniors and give back to the community that helped me grow."
];
let d = 0;
$("#dreamBtn").addEventListener("click", () => {
  const q = $("#dreamText");
  q.style.opacity = 0;
  setTimeout(() => {
    d = (d + 1) % dreams.length;
    q.textContent = dreams[d];
    q.style.opacity = 1;
  }, 300);
});

/* ---------- Hobby click ---------- */
$$(".hobby").forEach(h => h.addEventListener("click", () => toast(`I love ${h.textContent.trim().split(/\s+/).pop()}! 💜`)));

/* ---------- Project filter ---------- */
$$(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    $$(".project").forEach(p => {
      const show = f === "all" || p.dataset.cat === f;
      p.classList.toggle("hide", !show);
      if (show) { p.style.animation = "none"; void p.offsetWidth; p.style.animation = ""; }
    });
  });
});

/* ---------- Copy email ---------- */
$("#copyEmail").addEventListener("click", () => {
  const email = $("#emailText").textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email).then(() => toast("Email copied! 📋"));
  } else {
    toast(email);
  }
});

/* ---------- Contact form -> opens the user's mail app ---------- */
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#cName").value.trim();
  const from = $("#cEmail").value.trim();
  const msg = $("#cMsg").value.trim();
  const to = $("#emailText").textContent;
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${msg}\n\n— ${name} (${from})`);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  $("#formNote").textContent = "Opening your email app... thank you! 💜";
  e.target.reset();
});