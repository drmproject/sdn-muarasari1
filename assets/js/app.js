const loader = document.getElementById('loader');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const themeBtn = document.getElementById('themeBtn');
const year = document.getElementById('year');
const progressBar = document.getElementById('progressBar');
const toTop = document.getElementById('toTop');

const assetPrefix = window.location.pathname.includes('/admin/') ? '../' : '';
const logoAsset = `${assetPrefix}assets/img/logo-base64.txt`;

const setLogoBox = (el, size, radius, shadow) => {
  el.style.width = size;
  el.style.height = size;
  el.style.borderRadius = radius;
  el.style.boxShadow = shadow;
  el.style.padding = '0';
};

const applySchoolLogo = (dataUri) => {
  document.querySelectorAll('.brand__logo').forEach((el) => {
    el.innerHTML = `<img src="${dataUri}" alt="Logo SD Negeri Muarasari 1" loading="eager" decoding="async">`;
    el.setAttribute('aria-label', 'Logo SD Negeri Muarasari 1');
    el.setAttribute('role', 'img');
  });

  document.querySelectorAll('.brand__logo--header').forEach((el) => {
    setLogoBox(el, '48px', '16px', 'var(--shadow)');
  });

  document.querySelectorAll('.brand__logo--hero').forEach((el) => {
    setLogoBox(el, '108px', '30px', 'var(--shadow-strong)');
  });

  let icon = document.querySelector("link[rel='icon']");
  if (!icon) {
    icon = document.createElement('link');
    icon.rel = 'icon';
    document.head.appendChild(icon);
  }
  icon.href = dataUri;
};

fetch(logoAsset)
  .then((response) => response.text())
  .then((base64) => {
    const trimmed = base64.trim();
    if (trimmed) applySchoolLogo(`data:image/webp;base64,${trimmed}`);
  })
  .catch(() => {});

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
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
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
    navigator.serviceWorker.register(`${assetPrefix}sw.js`).catch(() => {});
  });
}
