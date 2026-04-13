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

  // --- Tooltip (created lazily on first hover) ---
  var tooltip = null;
  function showTooltip(d, ev) {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'etym-tooltip';
      els.canvas.appendChild(tooltip);
    }
    tooltip.innerHTML =
      '<strong>' + escapeHtml(d.word) + '</strong> · ' +
      (LANG_LABEL[d.language] || 'Unknown') + '<br>' +
      '<em>' + escapeHtml(d.gloss || '') + '</em>';
    var rect = els.canvas.getBoundingClientRect();
    tooltip.style.left = (ev.clientX - rect.left + 12) + 'px';
    tooltip.style.top  = (ev.clientY - rect.top + 12) + 'px';
    tooltip.style.display = 'block';
  }
  function hideTooltip() {
    if (tooltip) tooltip.style.display = 'none';
  }

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

  // --- Subgraph builder ---
  // Returns { nodes, links } for the 2-hop radius around focusId.
  // Nodes include the focused entry, all its ancestors up to 2 levels,
  // and all its 1-hop descendants (children that list focusId as parent).
  function buildSubgraph(focusId) {
    var nodes = [];
    var links = [];
    var seen = {};

    function addNode(id, depth) {
      if (seen[id]) return;
      var entry = byId[id] || { id: id, word: id, language: 'unk', gloss: '(unknown)', parents: [] };
      seen[id] = true;
      nodes.push({
        id: id,
        word: entry.word,
        language: entry.language || 'unk',
        gloss: entry.gloss || '',
        depth: depth,
        isFocus: id === focusId
      });
    }

    // Walk up parents, capped at 2 levels back from focus
    function walkAncestors(id, depth) {
      if (depth > 2) return;
      addNode(id, depth);
      var entry = byId[id];
      if (!entry || !entry.parents) return;
      entry.parents.forEach(function (pid) {
        links.push({ source: id, target: pid });
        walkAncestors(pid, depth + 1);
      });
    }

    walkAncestors(focusId, 0);

    // Add 1-hop descendants (other entries that name focusId as a parent)
    rawEntries.forEach(function (e) {
      if ((e.parents || []).indexOf(focusId) >= 0) {
        addNode(e.id, -1);
        links.push({ source: e.id, target: focusId });
      }
    });

    return { nodes: nodes, links: links };
  }

  function render() {
    var sub = buildSubgraph(state.focusId);

    // Clear canvas
    els.canvas.innerHTML = '';

    var width = els.canvas.clientWidth || 800;
    var height = els.canvas.clientHeight || 600;

    var svg = d3.select(els.canvas)
      .append('svg')
      .attr('viewBox', [0, 0, width, height]);

    var g = svg.append('g');

    // Force simulation
    var simulation = d3.forceSimulation(sub.nodes)
      .force('link', d3.forceLink(sub.links).id(function (d) { return d.id; }).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));

    var link = g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.5)
      .selectAll('line')
      .data(sub.links)
      .enter().append('line')
      .attr('stroke-width', 1.5);

    var nodeGroup = g.append('g')
      .selectAll('g')
      .data(sub.nodes)
      .enter().append('g')
      .attr('class', 'etym-node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', function (ev, d) {
          if (!ev.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', function (ev, d) { d.fx = ev.x; d.fy = ev.y; })
        .on('end', function (ev, d) {
          if (!ev.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        }));

    nodeGroup
      .on('mouseover', function (ev, d) { showTooltip(d, ev); })
      .on('mousemove', function (ev, d) { showTooltip(d, ev); })
      .on('mouseout', hideTooltip)
      .on('click', function (ev, d) {
        ev.stopPropagation();
        hideTooltip();
        if (d.isFocus) {
          // Center-click = go back one step
          if (state.history.length > 0) {
            var prev = state.history.pop();
            state.focusId = prev;
            history.pushState({ focusId: prev }, '', '?w=' + encodeURIComponent(prev));
            render();
          } else {
            showLanding();
          }
        } else {
          focusOn(d.id);
        }
      });

    nodeGroup.append('circle')
      .attr('r', function (d) {
        if (d.isFocus) return 24;
        if (d.depth === 1 || d.depth === -1) return 16;
        return 10;
      })
      .attr('fill', function (d) { return LANG_COLOR[d.language] || LANG_COLOR.unk; })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    nodeGroup.append('text')
      .attr('dy', function (d) { return d.isFocus ? 38 : 26; })
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', 'var(--text-color, #333)')
      .text(function (d) { return d.word; });

    simulation.on('tick', function () {
      link
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; });

      nodeGroup.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    });

    // Side panel — keep the minimal version for this task, flesh out in Task 8
    var focus = byId[state.focusId];
    els.panel.innerHTML =
      '<h2>' + escapeHtml(focus.word) + '</h2>' +
      '<div class="etym-panel-lang">' + (LANG_LABEL[focus.language] || 'Unknown') + '</div>' +
      '<div class="etym-panel-gloss">"' + escapeHtml(focus.gloss || '') + '"</div>';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
