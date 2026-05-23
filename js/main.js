// ─── NAVBAR ACTIVE STATE ──────────────────────────
(function setActiveNav() {
  const current = location.pathname.split('/').pop() || '/home.html';
  document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes(current) || (current === '/home.html' && href.includes('home'))) {
      link.classList.add('active');
    }
  });
})();

// ─── MOBILE HAMBURGER ────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }

  if (btn && sidebar && overlay) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

// ─── COPY CODE BUTTONS ───────────────────────────
function initCopyButtons() {
  document.querySelectorAll('.code-copy').forEach(btn => {
    btn.addEventListener('click', function () {
      const block = this.closest('.code-block').querySelector('.code-body');
      const text = block.innerText || block.textContent;
      navigator.clipboard.writeText(text.trim()).then(() => {
        const orig = this.textContent;
        this.textContent = '✓ Copied!';
        this.style.color = 'var(--accent-green)';
        this.style.borderColor = 'var(--accent-green)';
        setTimeout(() => {
          this.textContent = orig;
          this.style.color = '';
          this.style.borderColor = '';
        }, 1800);
      });
    });
  });
}

// ─── SCROLL REVEAL ───────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeUp 0.5s ease both';
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.chapter-card, .code-block, .info-box, .video-container').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ─── TERMINAL TYPEWRITER ─────────────────────────
function initTypewriter() {
  const lines = document.querySelectorAll('[data-type]');
  if (!lines.length) return;
  let delay = 400;
  lines.forEach(line => {
    const text = line.getAttribute('data-type');
    const speed = parseInt(line.getAttribute('data-speed') || '40');
    line.textContent = '';
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        line.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delay);
    delay += text.length * speed + 300;
  });
}

// ─── INIT ─────────────────────────────────────────
function initLessonClips() {
  document.querySelectorAll('.lesson-clip').forEach(clip => {
    const steps = (clip.getAttribute('data-steps') || '')
      .split('|')
      .map(item => item.trim())
      .filter(Boolean);
    const duration = Number(clip.getAttribute('data-duration') || 9);
    const title = clip.querySelector('.clip-heading');
    const line = clip.querySelector('.clip-line');
    const button = clip.querySelector('.clip-play');
    const progress = clip.querySelector('.clip-progress span');
    const time = clip.querySelector('.clip-time');
    let timer = null;

    function render(index, elapsed) {
      const current = steps[index] || steps[0] || '';
      const parts = current.split('::');
      if (title) title.textContent = parts[0] || '';
      if (line) line.textContent = parts[1] || '';
      if (progress) progress.style.width = `${Math.min(100, (elapsed / duration) * 100)}%`;
      if (time) time.textContent = `${Math.ceil(Math.max(0, duration - elapsed))}s`;
    }

    function stop(reset) {
      if (timer) clearInterval(timer);
      timer = null;
      if (button) button.textContent = '▶';
      if (reset) {
        if (progress) progress.style.width = '0%';
        render(0, 0);
      }
    }

    if (!steps.length || !button) return;
    render(0, 0);
    button.addEventListener('click', () => {
      if (timer) {
        stop(false);
        return;
      }
      const startedAt = Date.now();
      button.textContent = 'Ⅱ';
      timer = setInterval(() => {
        const elapsed = Math.min(duration, (Date.now() - startedAt) / 1000);
        const index = Math.min(steps.length - 1, Math.floor((elapsed / duration) * steps.length));
        render(index, elapsed);
        if (elapsed >= duration) stop(true);
      }, 160);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initCopyButtons();
  initScrollReveal();
  initTypewriter();
  initLessonClips();
});
