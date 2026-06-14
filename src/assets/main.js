(function () {
  // 연도
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // 테마 토글 (저장: localStorage)
  var KEY = 'mimi-theme';
  function apply(t) { document.documentElement.setAttribute('data-theme', t); }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved) apply(saved);
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });

  // 홈 검색 필터
  var s = document.getElementById('tool-search');
  if (s) s.addEventListener('input', function () {
    var q = s.value.trim().toLowerCase();
    var cards = document.querySelectorAll('#tool-grid .card');
    for (var i = 0; i < cards.length; i++) {
      var name = cards[i].getAttribute('data-name') || '';
      cards[i].style.display = (!q || name.indexOf(q) > -1) ? '' : 'none';
    }
  });
})();
