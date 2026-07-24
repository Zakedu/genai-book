// curriculum.js — 저널형 학습 로드맵 + 온톨로지 개념 지도 (컨테이너 있을 때만)
(function () {
  const RELKO = { is_a: '~의 하위', part_of: '~의 부분', prerequisite: '선행', mitigates: '~를 완화', uses: '~를 사용', causes: '~를 유발', evaluates: '~를 평가' };
  const AREA_COLOR = { '개념': '#1A6FEF', '도구': '#C8A24A', '기법': '#2FA36B', '프롬프팅기초': '#2FA36B', 'RAG': '#7C5CBF', '에이전트': '#D9679A', '보안': '#B4482C', '거버넌스': '#C8862A', '추론': '#0D8FA8', '응용': '#5AA84A', '평가': '#8B7BE0', '기타': '#94A3B8' };
  // 단계(학습 깊이)별 이름·부제 — 에디토리얼 라벨
  const STAGE = [
    ['기초', '선행 없이 시작하는 개념'],
    ['토대', '기초 개념 위에 쌓기'],
    ['원리', '작동 방식을 이해하기'],
    ['활용', '원리를 문제에 적용'],
    ['통합', '여러 개념을 엮어 쓰기'],
    ['심화', '한 걸음 더 들어가기'],
    ['전문', '실무 수준의 응용'],
    ['고급', '고급 기법과 설계'],
    ['응용 심화', '복합 시나리오'],
    ['정점', '가장 깊은 층'],
    ['확장', '경계의 주제'],
  ];

  function assetUrl(name) {
    const base = (document.querySelector('link[rel=canonical]')?.href || location.href).replace(/(\/genai-book\/).*/, '$1');
    return base + 'assets/' + name;
  }
  const pad2 = (n) => String(n).padStart(2, '0');

  // ─────────── 학습 로드맵 (저널형) ───────────
  async function initRoadmap(root) {
    const C = await fetch(assetUrl('curriculum.json')).then(r => r.json()).catch(() => null);
    if (!C) { root.innerHTML = '<p class="none">커리큘럼 데이터를 불러오지 못했습니다.</p>'; return; }
    const meta = C.concept_meta, pre = C.prerequisites, rel = C.relations, STR = C.prereq_strength || {};
    const TRACKS = C.meta.tracks || [];
    let curTrack = '전체', openConcept = null;
    const nxt = {};
    for (const [c, ps] of Object.entries(pre)) for (const p of ps) (nxt[p] = nxt[p] || []).push(c);
    const strength = (s, t) => STR[s + '|' + t] || 'hard';
    const inTrack = (c) => curTrack === '전체' || (meta[c].tracks || []).includes(curTrack);

    // 트랙 표시명 — APEX 톤(간결한 페르소나)
    const TLABEL = { '전체': '전체', '입문': '입문자', '실무사용자': '실무자', '구현자': '개발자', '관리자': '의사결정자', '창작자': '창작자' };
    root.innerHTML = '<div class="curr-layout" id="curr-layout"><div class="curr-journal"><div class="curr-tracks" id="curr-tracks"><span class="lbl">학습자 트랙</span></div><div id="curr-body"></div></div><aside class="curr-panel" id="curr-panel"></aside></div>';
    const layout = root.querySelector('#curr-layout'), panel = root.querySelector('#curr-panel');
    const tbar = root.querySelector('#curr-tracks');
    ['전체', ...TRACKS].forEach(t => {
      const b = document.createElement('button'); b.className = 'curr-tk' + (t === '전체' ? ' on' : ''); b.textContent = TLABEL[t] || t; b.dataset.track = t;
      b.onclick = () => { curTrack = t; openConcept = null; [...tbar.querySelectorAll('.curr-tk')].forEach(x => x.classList.toggle('on', x.dataset.track === t)); render(); };
      tbar.appendChild(b);
    });
    const body = root.querySelector('#curr-body');
    const itemEl = {};

    function render() {
      body.innerHTML = ''; for (const k in itemEl) delete itemEl[k];
      for (let L = 0; L < C.meta.levels; L++) {
        const cs = (C.levels[String(L)] || []).filter(inTrack); if (!cs.length) continue;
        const st = STAGE[L] || ['학습 깊이 ' + L, ''];
        const stage = document.createElement('section'); stage.className = 'curr-stage';
        stage.innerHTML = `<div class="curr-stage-head"><div class="curr-num">${pad2(L)}</div>` +
          `<h2 class="curr-stage-title">${st[0]}</h2><div class="curr-stage-sub">${st[1]}</div></div>`;
        const grid = document.createElement('div'); grid.className = 'curr-grid';
        cs.sort((a, b) => meta[b].degree - meta[a].degree);
        for (const c of cs) {
          const it = document.createElement('button'); it.className = 'curr-item';
          it.innerHTML = `<span class="nm">${c}</span>`;
          it.onclick = () => toggle(c);
          it.onmouseenter = () => { if (!openConcept) highlightChain(c); };
          it.onmouseleave = () => { if (!openConcept) clearMarks(); };
          grid.appendChild(it); itemEl[c] = it;
        }
        stage.appendChild(grid); body.appendChild(stage);
      }
      if (openConcept && itemEl[openConcept]) expand(openConcept); else closePanel();
    }

    function clearMarks() {
      for (const el of Object.values(itemEl)) el.className = 'curr-item';
      body.querySelectorAll('.curr-stage.collapsed').forEach(s => s.classList.remove('collapsed'));
    }
    // 연결(하이라이트)된 개념이 하나도 없는 단계는 접는다
    function collapseIrrelevant() {
      body.querySelectorAll('.curr-stage').forEach(stage => {
        const any = [...stage.querySelectorAll('.curr-item')].some(it => !it.classList.contains('faded') && it.className !== 'curr-item');
        stage.classList.toggle('collapsed', !any);
      });
    }
    function closePanel() { openConcept = null; layout.classList.remove('has-sel'); panel.innerHTML = ''; clearMarks(); }
    function toggle(c) { if (openConcept === c) { closePanel(); } else { openConcept = c; expand(c); } }

    // 호버 시 인과 사슬(전체 선행 조상 + 직접 다음)을 색으로 — 클릭 없이 한 눈에
    function ancestors(c) {
      const seen = new Set(), out = [], stack = [...(pre[c] || [])];
      while (stack.length) { const p = stack.pop(); if (seen.has(p) || !itemEl[p]) continue; seen.add(p); out.push(p); (pre[p] || []).forEach(x => stack.push(x)); }
      return out;
    }
    function highlightChain(c) {
      for (const el of Object.values(itemEl)) el.classList.add('faded');
      if (itemEl[c]) itemEl[c].className = 'curr-item on';
      const direct = new Set(pre[c] || []);
      ancestors(c).forEach(p => {
        if (!itemEl[p]) return;
        const cls = direct.has(p) ? (strength(p, c) === 'deepens' ? 'deep' : 'hard') : 'chain';
        itemEl[p].className = 'curr-item ' + cls;
      });
      (nxt[c] || []).forEach(n => itemEl[n] && (itemEl[n].className = 'curr-item next'));
    }

    function expand(c) {
      clearMarks();
      const P = pre[c] || [], N = nxt[c] || [];
      const hard = P.filter(p => strength(p, c) === 'hard'), deep = P.filter(p => strength(p, c) === 'deepens');
      // 흐릿하게 + 관계별 색
      for (const el of Object.values(itemEl)) el.classList.add('faded');
      itemEl[c].className = 'curr-item on';
      hard.forEach(p => itemEl[p] && (itemEl[p].className = 'curr-item hard'));
      deep.forEach(p => itemEl[p] && (itemEl[p].className = 'curr-item deep'));
      N.forEach(n => itemEl[n] && (itemEl[n].className = 'curr-item next'));
      (rel[c] || []).forEach(r => { if (itemEl[r.t] && itemEl[r.t].classList.contains('faded')) itemEl[r.t].className = 'curr-item rel'; });

      const doc = meta[c].doc, tks = meta[c].tracks || [];
      // 연결된 개념을 방향(선행/다음/연관)과 함께 수집 → 영역(분류)별로 묶는다
      const conns = [], seen = new Set();
      const add = (name, dir, extra) => { if (seen.has(name) || !meta[name]) return; seen.add(name); conns.push({ name, dir, cat: meta[name].category, lv: meta[name].level, ...extra }); };
      hard.forEach(p => add(p, 'prereq', { st: 'hard' }));
      deep.forEach(p => add(p, 'prereq', { st: 'deep' }));
      N.forEach(n => add(n, 'next', {}));
      (rel[c] || []).filter(r => !r.in && RELKO[r.type] && r.type !== 'prerequisite').forEach(r => add(r.t, 'rel', { rl: RELKO[r.type] }));
      // 영역별 그룹 (연결 많은 영역 먼저)
      const byArea = {};
      conns.forEach(x => (byArea[x.cat] = byArea[x.cat] || []).push(x));
      const areas = Object.entries(byArea).sort((a, b) => b[1].length - a[1].length);
      const AC = AREA_COLOR;
      const mark = (x) => x.dir === 'prereq' ? `<span class="dir ${x.st}">←</span>` : x.dir === 'next' ? `<span class="dir n">→</span>` : `<span class="dir r">${x.rl}</span>`;
      const areaSecs = areas.map(([cat, items]) => {
        const col = AC[cat] || '#94A3B8';
        return `<div class="curr-area"><div class="curr-area-h" style="--ac:${col}">${cat}<span class="ct">${items.length}</span></div><ul>` +
          items.sort((a, b) => a.lv - b.lv).map(x => `<li>${mark(x)}<span class="lv">L${x.lv}</span>${x.name}</li>`).join('') + `</ul></div>`;
      }).join('');
      panel.innerHTML =
        `<button class="curr-panel-x" title="닫기" aria-label="닫기">×</button>` +
        `<h3>${c}</h3><div class="dmeta">${meta[c].category} · 학습 깊이 L${meta[c].level}</div>` +
        `<div class="dtags">${tks.map(t => `<span class="curr-tag">${t}</span>`).join('')}</div>` +
        (doc ? `<a class="docl" href="../${doc}/">교재 문서 열기 →</a>` : '') +
        `<div class="curr-conn-eyebrow">연결된 영역 <span class="leg"><span class="dir hard">←</span>필수 <span class="dir deep">←</span>심화 <span class="dir n">→</span>다음</span></div>` +
        `<div class="curr-areas">${areaSecs || '<p class="none">연결된 개념이 없습니다.</p>'}</div>`;
      panel.querySelector('.curr-panel-x').onclick = closePanel;
      layout.classList.add('has-sel');
      panel.scrollTop = 0;
      collapseIrrelevant();
    }
    render();
  }

  // ─────────── 온톨로지 개념 지도 ───────────
  async function initOntology(root) {
    const G = await fetch(assetUrl('ontology-graph.json')).then(r => r.json()).catch(() => null);
    if (!G) { root.innerHTML = '<p class="none">온톨로지 데이터를 불러오지 못했습니다.</p>'; return; }
    const css = getComputedStyle(document.body);
    const CAT = { '개념': '#1A6FEF', '도구': '#C8A24A', '기법': '#2FA36B', '프롬프팅기초': '#2FA36B', 'RAG': '#7C5CBF', '에이전트': '#D9679A', '보안': '#B4482C', '거버넌스': '#C8862A', '추론': '#0D8FA8', '응용': '#5AA84A', '평가': '#8B7BE0', '기타': '#94A3B8' };
    const legend = Object.entries({ '개념': CAT['개념'], '기법': CAT['기법'], 'RAG': CAT['RAG'], '에이전트': CAT['에이전트'], '보안': CAT['보안'], '도구': CAT['도구'], '평가': CAT['평가'] })
      .map(([k, v]) => `<span><b style="background:${v}"></b>${k}</span>`).join('');
    root.innerHTML = `<div class="onto-frame"><input class="onto-search" id="onto-search" placeholder="개념 검색…"><canvas id="onto-canvas"></canvas><div class="onto-legend">${legend}</div></div><div class="onto-tip" id="onto-tip"></div>`;
    const cv = root.querySelector('#onto-canvas'), ctx = cv.getContext('2d'), tip = root.querySelector('#onto-tip');
    let W, H, DPR;
    function resize() { DPR = devicePixelRatio || 1; W = cv.clientWidth; H = Math.max(600, Math.round(window.innerHeight * 0.72)); cv.style.height = H + 'px'; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
    const N = G.nodes.map(n => ({ ...n, x: 0, y: 0, vx: 0, vy: 0 }));
    resize(); N.forEach(n => { n.x = W / 2 + (Math.random() - .5) * Math.min(W, 520); n.y = H / 2 + (Math.random() - .5) * Math.min(H, 420); });
    const idx = new Map(N.map((n, i) => [n.id, i]));
    const E = G.edges.map(e => ({ ...e, s: idx.get(e.source), t: idx.get(e.target) })).filter(e => e.s != null && e.t != null);
    let cam = { x: 0, y: 0, z: 1 }, hover = null, drag = null, panning = false;
    const line = (css.getPropertyValue('--apex-border-strong').trim() || '#CBD5E1');
    const txt = (css.getPropertyValue('--md-typeset-color').trim() || '#0E1929');
    function tick() {
      for (const n of N) { n.vx *= .86; n.vy *= .86; }
      for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) {
        const a = N[i], b = N[j]; let dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy + .01);
        if (d < 250) { const f = (250 - d) / d * .8; a.vx += dx * f / d * 6; a.vy += dy * f / d * 6; b.vx -= dx * f / d * 6; b.vy -= dy * f / d * 6; }
      }
      for (const e of E) { const a = N[e.s], b = N[e.t]; let dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1; const f = (d - 115) * .008; a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f; }
      for (const n of N) { n.vx += (W / 2 - n.x) * .0016; n.vy += (H / 2 - n.y) * .0016; if (n !== drag) { n.x += n.vx; n.y += n.vy; } }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.save(); ctx.translate(cam.x, cam.y); ctx.scale(cam.z, cam.z);
      for (const e of E) { const a = N[e.s], b = N[e.t]; const hl = hover && (N[e.s] === hover || N[e.t] === hover); ctx.strokeStyle = hl ? (CAT[N[e.t].category] || line) : line; ctx.globalAlpha = hl ? .85 : .22; ctx.lineWidth = hl ? 1.6 : .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      ctx.globalAlpha = 1;
      for (const n of N) {
        const r = Math.max(4, Math.sqrt(n.degree) * 2.3);
        const dim = hover && hover !== n && !E.some(e => (N[e.s] === hover && N[e.t] === n) || (N[e.t] === hover && N[e.s] === n));
        ctx.globalAlpha = dim ? .16 : 1; ctx.fillStyle = CAT[n.category] || '#94A3B8';
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 7); ctx.fill();
        if (n.degree >= 4 || n === hover || cam.z > 1.5) { ctx.globalAlpha = dim ? .3 : 1; ctx.fillStyle = txt; ctx.font = '11.5px Pretendard, sans-serif'; ctx.fillText(n.id, n.x + r + 3, n.y + 4); }
        ctx.globalAlpha = 1;
      }
      ctx.restore(); requestAnimationFrame(() => { tick(); draw(); });
    }
    function pick(mx, my) { let best = null, bd = 400; for (const n of N) { const sx = n.x * cam.z + cam.x, sy = n.y * cam.z + cam.y; const d = (sx - mx) ** 2 + (sy - my) ** 2; const r = Math.max(4, Math.sqrt(n.degree) * 2.3) * cam.z + 6; if (d < r * r && d < bd) { bd = d; best = n; } } return best; }
    cv.addEventListener('mousemove', ev => {
      const rect = cv.getBoundingClientRect(); const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      if (panning) { cam.x += ev.movementX; cam.y += ev.movementY; return; }
      if (drag) { drag.x = (mx - cam.x) / cam.z; drag.y = (my - cam.y) / cam.z; return; }
      const n = pick(mx, my); hover = n;
      if (n) { const outs = E.filter(e => N[e.s] === n).map(e => `${RELKO[e.type] || e.type}→ ${N[e.t].id}`); const ins = E.filter(e => N[e.t] === n).map(e => `${N[e.s].id} →${RELKO[e.type] || e.type}`); tip.innerHTML = `<b>${n.id}</b> · ${n.category}<div style="color:var(--md-default-fg-color--light);margin-top:5px;font-size:.72rem;line-height:1.5">${outs.concat(ins).slice(0, 8).join('<br>') || '(관계 없음)'}</div>`; tip.style.left = Math.min(ev.clientX + 14, innerWidth - 290) + 'px'; tip.style.top = (ev.clientY + 14) + 'px'; tip.style.opacity = 1; } else tip.style.opacity = 0;
    });
    cv.addEventListener('mousedown', ev => { const rect = cv.getBoundingClientRect(); const n = pick(ev.clientX - rect.left, ev.clientY - rect.top); if (n) drag = n; else panning = true; });
    window.addEventListener('mouseup', () => { drag = null; panning = false; });
    cv.addEventListener('wheel', ev => { ev.preventDefault(); const rect = cv.getBoundingClientRect(); const f = ev.deltaY < 0 ? 1.1 : .9; const mx = ev.clientX - rect.left, my = ev.clientY - rect.top; cam.x = mx - (mx - cam.x) * f; cam.y = my - (my - cam.y) * f; cam.z *= f; }, { passive: false });
    cv.addEventListener('dblclick', ev => { const rect = cv.getBoundingClientRect(); const n = pick(ev.clientX - rect.left, ev.clientY - rect.top); if (n && n.doc) window.open('../' + n.doc + '/', '_blank'); });
    root.querySelector('#onto-search').addEventListener('input', e => { const q = e.target.value.trim().toLowerCase(); if (!q) return; const n = N.find(x => x.id.toLowerCase().includes(q) || (x.aliases || []).some(a => a.toLowerCase().includes(q))); if (n) { cam.z = 1.6; cam.x = W / 2 - n.x * cam.z; cam.y = H / 2 - n.y * cam.z; hover = n; } });
    window.addEventListener('resize', resize);
    for (let i = 0; i < 130; i++) tick(); draw();
  }

  function boot() {
    const rm = document.getElementById('learning-path-app'); if (rm && !rm.dataset.init) { rm.dataset.init = '1'; document.body.classList.add('curr-page'); initRoadmap(rm); }
    const on = document.getElementById('ontology-app'); if (on && !on.dataset.init) { on.dataset.init = '1'; document.body.classList.add('curr-page'); initOntology(on); }
  }
  if (typeof document$ !== 'undefined' && document$.subscribe) document$.subscribe(boot);
  else document.addEventListener('DOMContentLoaded', boot);
})();
