const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const items = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

items.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min((index % 5) * 55, 220)}ms`;
  observer.observe(item);
});

const navLinks = [...document.querySelectorAll('.terminal-bar nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.style.color = active ? 'var(--green)' : '';
    });
  });
}, { threshold: 0.35 });

sections.forEach(section => sectionObserver.observe(section));
