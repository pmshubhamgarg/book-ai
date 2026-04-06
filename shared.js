/**
 * shared.js — Book AI Library
 * Handles: Dark Mode · Progress Tracking · Quiz Engine
 * Include in every HTML page with the correct relative path to this file.
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────
  // DARK MODE
  // ─────────────────────────────────────────────────────────────────

  const DARK_KEY = 'book-ai-dark';

  function isDark() {
    const saved = localStorage.getItem(DARK_KEY);
    if (saved !== null) return saved === '1';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyDark(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(DARK_KEY, dark ? '1' : '0');
    const btn = document.getElementById('dark-toggle');
    if (btn) btn.textContent = dark ? '☀️' : '🌙';
  }

  function injectDarkCSS() {
    if (document.getElementById('dark-styles')) return;
    const s = document.createElement('style');
    s.id = 'dark-styles';
    s.textContent = `
      [data-theme="dark"] body { background:#0f0e17!important; color:#fffffe!important; }
      [data-theme="dark"] .nav { background:#1a1826!important; border-color:#2e2b3a!important; }
      [data-theme="dark"] .nav strong, [data-theme="dark"] .nav span { color:#c4c4d4!important; }
      [data-theme="dark"] .header { background:#0d0c14!important; }
      [data-theme="dark"] .wrap { background:#0f0e17!important; }
      [data-theme="dark"] h1,[data-theme="dark"] h2,[data-theme="dark"] h3,
      [data-theme="dark"] h4,[data-theme="dark"] p,[data-theme="dark"] li,
      [data-theme="dark"] td,[data-theme="dark"] span,[data-theme="dark"] label { color:#fffffe!important; }
      [data-theme="dark"] .book-label,[data-theme="dark"] .reading-time,
      [data-theme="dark"] .ch-time,[data-theme="dark"] .book-date,
      [data-theme="dark"] .section-title,[data-theme="dark"] .axis-label,
      [data-theme="dark"] .book-author,[data-theme="dark"] .book-desc { color:#a7a9be!important; }
      [data-theme="dark"] .concept-card,[data-theme="dark"] .story-card,
      [data-theme="dark"] .diagram-box,[data-theme="dark"] .action-box,
      [data-theme="dark"] .book-card,[data-theme="dark"] .chapter-card,
      [data-theme="dark"] .heuristic-card,[data-theme="dark"] .takeaway-card,
      [data-theme="dark"] .path-card,[data-theme="dark"] .core-idea,
      [data-theme="dark"] .meta-card,[data-theme="dark"] .chapter-link,
      [data-theme="dark"] .fi-cell,[data-theme="dark"] .quiz-section,
      [data-theme="dark"] .quiz-result { background:#1a1826!important; border-color:#2e2b3a!important; }
      [data-theme="dark"] .big-idea { background:#1a1826!important; }
      [data-theme="dark"] .analogy { background:#1a2234!important; }
      [data-theme="dark"] .example { background:#0f1f17!important; }
      [data-theme="dark"] .warning-box { background:#1f0e12!important; }
      [data-theme="dark"] .memory-hook { background:#1f1c0e!important; color:#fbbf24!important; border-color:#78350f!important; }
      [data-theme="dark"] .ch-num { background:#221f2e!important; border-color:#2e2b3a!important; }
      [data-theme="dark"] .trigger-cell,[data-theme="dark"] .simplicity-item,
      [data-theme="dark"] .habit-cell,[data-theme="dark"] .heuristic-card { background:#221f2e!important; border-color:#2e2b3a!important; }
      [data-theme="dark"] .five-whys td { background:#1a1826!important; border-color:#2e2b3a!important; }
      [data-theme="dark"] .five-whys tr:nth-child(even) td { background:#221f2e!important; }
      [data-theme="dark"] .five-whys tr:last-child td { background:#1f1c0e!important; }
      [data-theme="dark"] .takeaways li { border-color:#2e2b3a!important; }
      [data-theme="dark"] .book-footer,[data-theme="dark"] .connect-row,
      [data-theme="dark"] .chapter-links { border-color:#2e2b3a!important; }
      [data-theme="dark"] .quiz-option { background:#221f2e!important; border-color:#2e2b3a!important; color:#fffffe!important; }
      [data-theme="dark"] .quiz-option:hover:not(:disabled) { background:#2e2b3a!important; }
      [data-theme="dark"] #mark-read-btn:not(.is-read) { background:#4f46e5!important; }
    `;
    document.head.appendChild(s);
  }

  function insertDarkToggle() {
    const nav = document.querySelector('.nav');
    if (!nav || document.getElementById('dark-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'dark-toggle';
    btn.title = 'Toggle dark mode';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:1.1rem;padding:2px 6px;margin-left:auto;line-height:1;flex-shrink:0;';
    btn.textContent = isDark() ? '☀️' : '🌙';
    btn.addEventListener('click', () => applyDark(!isDark()));
    nav.appendChild(btn);
  }

  // ─────────────────────────────────────────────────────────────────
  // PROGRESS TRACKING
  // ─────────────────────────────────────────────────────────────────

  const PROG_KEY = 'book-ai-progress';

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(PROG_KEY)) || { read: {}, dates: [] }; }
    catch { return { read: {}, dates: [] }; }
  }

  function saveProgress(p) {
    localStorage.setItem(PROG_KEY, JSON.stringify(p));
  }

  // Derive a unique key like "hooked/ch01-the-habit-zone" from the current URL
  function getChapterKey() {
    const m = window.location.pathname.match(/outputs\/([^/]+)\/(ch[^.]+)/);
    return m ? `${m[1]}/${m[2]}` : null;
  }

  function markChapterRead(key) {
    const p = getProgress();
    if (p.read[key]) return;
    p.read[key] = true;
    const today = new Date().toISOString().slice(0, 10);
    if (!p.dates.includes(today)) p.dates.push(today);
    saveProgress(p);
  }

  function getStreak() {
    const dates = [...(getProgress().dates || [])].sort().reverse();
    if (!dates.length) return 0;
    let streak = 0;
    let ref = new Date(); ref.setHours(0,0,0,0);
    for (const d of dates) {
      const day = new Date(d); day.setHours(0,0,0,0);
      const diff = Math.round((ref - day) / 86400000);
      if (diff <= 1) { streak++; ref = day; }
      else break;
    }
    return streak;
  }

  function getTotalRead() {
    return Object.keys(getProgress().read).length;
  }

  function insertMarkReadButton() {
    const key = getChapterKey();
    if (!key) return;
    const wrap = document.querySelector('.wrap');
    if (!wrap) return;

    const isRead = !!getProgress().read[key];
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'text-align:center;padding:40px 0 8px;';
    const btn = document.createElement('button');
    btn.id = 'mark-read-btn';
    if (isRead) btn.classList.add('is-read');
    btn.style.cssText = `background:${isRead ? '#059669' : '#4f46e5'};color:#fff;border:none;padding:13px 36px;border-radius:99px;font-size:1rem;font-weight:700;cursor:${isRead ? 'default' : 'pointer'};transition:background .2s;box-shadow:0 2px 12px rgba(79,70,229,.25);`;
    btn.textContent = isRead ? '✓ Chapter Read' : '📖 Mark as Read';
    if (!isRead) {
      btn.addEventListener('click', () => {
        markChapterRead(key);
        btn.textContent = '🎉 Nice one!';
        btn.style.background = '#059669';
        btn.classList.add('is-read');
        btn.style.cursor = 'default';
        setTimeout(() => { btn.textContent = '✓ Chapter Read'; }, 2000);
        updateChapterCardIndicators();
      });
    }
    wrapper.appendChild(btn);
    wrap.appendChild(wrapper);
  }

  // On book index pages — add ✓ to already-read chapter cards
  function updateChapterCardIndicators() {
    const p = getProgress();
    const pathParts = window.location.pathname.split('/');
    // Find book slug (parent folder of index.html)
    const idxPos = pathParts.indexOf('index.html');
    const bookSlug = idxPos > 0 ? pathParts[idxPos - 1] : null;
    if (!bookSlug || bookSlug === 'book-ai') return;

    document.querySelectorAll('.chapter-card').forEach(card => {
      const href = card.getAttribute('href') || '';
      const slug = href.replace('.html', '');
      if (!slug.startsWith('ch')) return;
      const key = `${bookSlug}/${slug}`;
      const arrow = card.querySelector('.ch-arrow');
      if (p.read[key] && arrow && arrow.textContent === '›') {
        arrow.textContent = '✓';
        arrow.style.color = '#059669';
        arrow.style.fontWeight = '700';
      }
    });
  }

  // Update dynamic stat elements on index pages
  function updateStats() {
    const streak = getStreak();
    const total  = getTotalRead();
    const el = id => document.getElementById(id);
    if (el('stat-streak')) el('stat-streak').textContent = streak;
    if (el('stat-total'))  el('stat-total').textContent  = total;
    if (el('stat-streak-label')) el('stat-streak-label').textContent = streak === 1 ? 'day streak' : 'day streak';
  }

  // ─────────────────────────────────────────────────────────────────
  // QUIZ ENGINE
  // ─────────────────────────────────────────────────────────────────

  function buildQuiz() {
    const dataEl = document.getElementById('quiz-data');
    const container = document.getElementById('quiz-container');
    if (!dataEl || !container) return;

    let questions;
    try { questions = JSON.parse(dataEl.textContent.trim()); }
    catch (e) { console.error('Quiz parse error', e); return; }

    let current = 0, score = 0, answered = false;

    function progressBar(n, total) {
      const pct = Math.round((n / total) * 100);
      return `<div style="background:#e0e7ff;border-radius:99px;height:5px;margin-bottom:18px;">
        <div style="background:#4f46e5;height:5px;border-radius:99px;width:${pct}%;transition:width .4s;"></div>
      </div>`;
    }

    function render() {
      if (current >= questions.length) {
        const pct = Math.round((score / questions.length) * 100);
        const msg = pct >= 80 ? ['🎉', 'Locked in!', 'This chapter is solid in your memory.']
                  : pct >= 50 ? ['👍', 'Getting there', 'Re-read the concepts you missed, then try again.']
                  :             ['📚', 'Need more time', 'Go back and re-read this chapter first.'];
        container.innerHTML = `
          <div class="quiz-result" style="text-align:center;padding:28px 20px;background:#f8f7ff;border-radius:12px;">
            <div style="font-size:2.5rem;margin-bottom:10px;">${msg[0]}</div>
            <div style="font-size:1.6rem;font-weight:800;color:#4f46e5;margin-bottom:4px;">${score}/${questions.length}</div>
            <div style="font-weight:700;font-size:1rem;margin-bottom:6px;">${msg[1]}</div>
            <p style="font-size:0.88rem;color:#6b7280;margin-bottom:20px;">${msg[2]}</p>
            <button onclick="window.__quizRestart()" style="background:#4f46e5;color:#fff;border:none;padding:10px 28px;border-radius:99px;font-size:0.9rem;font-weight:600;cursor:pointer;">Try Again</button>
          </div>`;
        // Save quiz completion to progress
        const key = getChapterKey();
        if (key && pct >= 60) markChapterRead(key);
        return;
      }

      const q = questions[current];
      answered = false;
      container.innerHTML = `
        <div>
          <div style="font-size:0.78rem;color:#9ca3af;font-weight:600;margin-bottom:6px;text-transform:uppercase;letter-spacing:.06em;">Question ${current + 1} of ${questions.length}</div>
          ${progressBar(current, questions.length)}
          <div style="font-weight:600;font-size:0.98rem;line-height:1.55;margin-bottom:16px;">${q.q}</div>
          <div id="q-options" style="display:flex;flex-direction:column;gap:9px;">
            ${q.options.map((opt, i) => `
              <button class="quiz-option" data-i="${i}" style="
                background:#fff;border:1.5px solid #e5e7eb;border-radius:10px;
                padding:12px 16px;text-align:left;font-size:0.9rem;line-height:1.4;
                cursor:pointer;transition:border-color .15s,background .15s;width:100%;
              ">${opt}</button>`).join('')}
          </div>
          <div id="q-feedback" style="min-height:24px;margin-top:14px;font-size:0.88rem;font-weight:600;"></div>
        </div>`;

      container.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('mouseenter', () => { if (!answered) btn.style.borderColor = '#a5b4fc'; });
        btn.addEventListener('mouseleave', () => { if (!answered) btn.style.borderColor = '#e5e7eb'; });
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const chosen = parseInt(btn.dataset.i);
          const correct = q.answer;

          container.querySelectorAll('.quiz-option').forEach((b, i) => {
            b.disabled = true;
            b.style.cursor = 'default';
            if (i === correct) { b.style.background = '#dcfce7'; b.style.borderColor = '#22c55e'; b.style.color = '#166534'; }
            else if (i === chosen) { b.style.background = '#fee2e2'; b.style.borderColor = '#ef4444'; b.style.color = '#991b1b'; }
          });

          if (chosen === correct) score++;

          const fb = document.getElementById('q-feedback');
          if (fb) fb.textContent = chosen === correct ? '✓ Correct!' : `✗ The answer was: "${q.options[correct]}"`;
          if (fb) fb.style.color = chosen === correct ? '#059669' : '#dc2626';

          const next = document.createElement('button');
          next.textContent = current + 1 < questions.length ? 'Next →' : 'See Results →';
          next.style.cssText = 'display:block;margin:16px auto 0;background:#4f46e5;color:#fff;border:none;padding:10px 28px;border-radius:99px;font-size:0.9rem;font-weight:600;cursor:pointer;';
          next.addEventListener('click', () => { current++; render(); });
          container.appendChild(next);
        });
      });
    }

    window.__quizRestart = function () { current = 0; score = 0; answered = false; render(); };
    render();
  }

  // ─────────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    injectDarkCSS();
    applyDark(isDark());
    insertDarkToggle();
    updateStats();
    updateChapterCardIndicators();

    if (getChapterKey()) {
      insertMarkReadButton();
      buildQuiz();
    }
  });

})();
