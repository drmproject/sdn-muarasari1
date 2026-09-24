const loader = document.getElementById('loader');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const themeBtn = document.getElementById('themeBtn');
const year = document.getElementById('year');
const progressBar = document.getElementById('progressBar');
const toTop = document.getElementById('toTop');

if (year) year.textContent = new Date().getFullYear();

window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('is-hidden'), 350);
});

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav__links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const storedTheme = localStorage.getItem('theme');
if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);

const updateThemeIcon = () => {
  if (!themeBtn) return;
  themeBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
};
updateThemeIcon();

themeBtn?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
  updateThemeIcon();
});

window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  if (progressBar) progressBar.style.width = `${Math.min(100, scrolled)}%`;
  if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 450);
});

toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.getAttribute('data-counter') || 0);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 55));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        obs.unobserve(el);
      }
      el.textContent = current;
    }, 20);
  });
}, { threshold: 0.5 });

counters.forEach((el) => counterObserver.observe(el));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
