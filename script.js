document.getElementById('year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });
document.querySelectorAll('.project-card, .skill-group, .about-layout').forEach(item => observer.observe(item));
