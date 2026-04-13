(function () {
  'use strict';

  var LANG_COLOR = {
    pie: '#d4af37',
    grc: '#4a90e2',
    la:  '#c0392b',
    gem: '#27ae60',
    fro: '#8e44ad',
    sa:  '#e67e22',
    en:  '#888888',
    unk: '#cccccc'
  };

  var LANG_LABEL = {
    pie: 'Proto-Indo-European',
    grc: 'Ancient Greek',
    la:  'Latin',
    gem: 'Germanic',
    fro: 'Old French',
    sa:  'Sanskrit',
    en:  'English',
    unk: 'Unknown'
  };

  // --- Load dataset ---
  var dataEl = document.getElementById('etym-data');
  if (!dataEl) {
    console.error('etymology: no #etym-data element');
    return;
  }
  var rawEntries = JSON.parse(dataEl.textContent);
  var byId = {};
  rawEntries.forEach(function (e) { byId[e.id] = e; });

  // --- DOM refs ---
  var els = {
    search:     document.getElementById('etym-search'),
    surprise:   document.getElementById('etym-surprise'),
    home:       document.getElementById('etym-home'),
    miss:       document.getElementById('etym-search-miss'),
    landing:    document.getElementById('etym-landing'),
    featured:   document.getElementById('etym-featured'),
    focus:      document.getElementById('etym-focus'),
    canvas:     document.getElementById('etym-canvas'),
    panel:      document.getElementById('etym-panel')
  };

  // --- State ---
  var state = {
    mode: 'landing',  // 'landing' | 'focus'
    focusId: null,
    history: []       // stack of focusIds for in-page back
  };

  // --- Featured roots rendering ---
  function renderFeatured() {
    els.featured.innerHTML = '';
    rawEntries
      .filter(function (e) { return e.featured; })
      .forEach(function (e) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = e.word;
        btn.setAttribute('aria-label', 'Explore ' + e.word);
        btn.addEventListener('click', function () { focusOn(e.id); });
        li.appendChild(btn);
        els.featured.appendChild(li);
      });
  }

  // --- Mode switching ---
  function showLanding() {
    state.mode = 'landing';
    state.focusId = null;
    els.landing.hidden = false;
    els.focus.hidden = true;
    els.home.style.display = 'none';
    els.miss.hidden = true;
    history.replaceState({}, '', window.location.pathname);
  }

  function focusOn(id) {
    if (!byId[id]) {
      showMiss(id);
      return;
    }
    state.mode = 'focus';
    if (state.focusId && state.focusId !== id) {
      state.history.push(state.focusId);
    }
    state.focusId = id;
    els.landing.hidden = true;
    els.focus.hidden = false;
    els.home.style.display = '';
    els.miss.hidden = true;
    history.pushState({ focusId: id }, '', '?w=' + encodeURIComponent(id));
    render();
  }

  function showMiss(query) {
    els.miss.textContent = '"' + query + '" is not in the seed dataset yet. Try one of the featured roots below.';
    els.miss.hidden = false;
  }

  // --- Rendering placeholder (to be built in later tasks) ---
  function render() {
    els.canvas.innerHTML = '<p style="padding:20px;color:#888;">Graph for: ' + state.focusId + '</p>';
    els.panel.innerHTML = '<p>Panel for: ' + state.focusId + '</p>';
  }

  // --- Search ---
  function handleSearch(query) {
    query = (query || '').trim().toLowerCase();
    if (!query) return;
    // Exact id match first
    if (byId[query]) { focusOn(query); return; }
    // Fall back to word match (case-insensitive, strips non-letter chars)
    var normalized = query.replace(/[^a-zα-ωἀ-ῼ]/gi, '');
    var hit = rawEntries.find(function (e) {
      var w = (e.word || '').toLowerCase().replace(/[^a-zα-ωἀ-ῼ]/gi, '');
      return w === normalized;
    });
    if (hit) { focusOn(hit.id); return; }
    showMiss(query);
  }

  els.search.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') handleSearch(els.search.value);
  });

  els.surprise.addEventListener('click', function () {
    var pick = rawEntries[Math.floor(Math.random() * rawEntries.length)];
    focusOn(pick.id);
  });

  els.home.addEventListener('click', showLanding);

  // --- Browser history ---
  window.addEventListener('popstate', function (ev) {
    var params = new URLSearchParams(window.location.search);
    var w = params.get('w');
    if (w && byId[w]) {
      state.focusId = w;
      state.mode = 'focus';
      els.landing.hidden = true;
      els.focus.hidden = false;
      els.home.style.display = '';
      render();
    } else {
      showLanding();
    }
  });

  // --- Init ---
  renderFeatured();
  var initialParams = new URLSearchParams(window.location.search);
  var initialId = initialParams.get('w');
  if (initialId && byId[initialId]) {
    focusOn(initialId);
  } else {
    showLanding();
  }

  // Expose for debug
  window._etym = { state: state, byId: byId, focusOn: focusOn };
})();
