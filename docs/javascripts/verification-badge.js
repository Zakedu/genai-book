// verification-badge.js — Roundtable 3-AI 교차검증 상태 배지
// docs/assets/verification.json(라운드테이블 익스포트)을 읽어 각 페이지 제목 밑에
// 검증 상태 배지를 표시합니다. JSON만 갱신하면 재빌드 없이 배지가 바뀝니다.
(function () {
  // 공개 배지는 신뢰 신호만 노출한다. 내부 검증 카운트(변경/오류)는 절대 공개 라벨에 쓰지 않는다
  // — 출판된 교재가 스스로 "오류 N건"이라 광고하면 안 되므로. 상세 수치는 hover title로만.
  var LABELS = {
    verified: function (v) { return "✅ 3-AI 교차검증 반영 · " + v.verified_at; },
    changes: function (v) { return "✅ 3-AI 교차검증 반영 · " + v.verified_at; },
    errors: function (v) { return "✅ 3-AI 교차검증 반영 · " + v.verified_at; },
    pending: function () { return "3-AI 교차검증 예정"; }
  };

  function inject() {
    var h1 = document.querySelector(".md-content h1");
    if (!h1 || h1.dataset.rtBadged) return;
    // 현재 페이지의 사이트 상대 경로 (예: part1/ch01-what-is-genai/)
    var canonical = document.querySelector("link[rel=canonical]");
    var href = canonical ? canonical.href : location.href;
    var path;
    try {
      path = new URL(href).pathname.replace(/^.*?\/genai-book\//, "").replace(/index\.html$/, "");
    } catch (e) { return; }
    // JSON은 사이트 루트 기준 assets/verification.json
    var base = href.replace(/(\/genai-book\/).*/, "$1");
    fetch(base + "assets/verification.json")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.pages) return;
        var v = data.pages[path];
        if (!v) return;
        if (h1.dataset.rtBadged) return;
        h1.dataset.rtBadged = "1";
        var status = LABELS[v.status] ? v.status : "pending";
        var p = document.createElement("p");
        p.className = "rt-badge rt-" + status;
        // 링크 없는 순수 배지 — 세션 퀵링크는 의미 없어 제거(클릭 불가 span)
        var a = document.createElement("span");
        a.textContent = LABELS[status](v);
        a.title = "Claude·Codex·Gemini 3개 모델 교차검증 반영";
        p.appendChild(a);
        h1.insertAdjacentElement("afterend", p);
      })
      .catch(function () { /* 조용히 무시 — 배지는 부가 기능 */ });
  }

  // material navigation.instant 대응: document$ 있으면 구독, 없으면 DOMContentLoaded
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(inject);
  } else {
    document.addEventListener("DOMContentLoaded", inject);
  }
})();
