/**
 * Clause Wrap (실험)
 * 한국어 줄바꿈을 절(clause) 단위로 유도.
 * 우선순위: ① 문장 끝(. ! ? …) → ② 쉼표·구분(, ; :) → ③ 연결어미(되어/하여/…) 뒤.
 * 그 외 어절 사이 공백은 비분리(nbsp, U+00A0)로 묶어 의미 덩어리 중간 끊김 방지.
 * 붙이기(word-joiner U+2060):
 *   ④ 닫는 괄호/따옴표 + 조사(한글)  →  ")와" 끊김 방지
 *   ⑤ 병렬 기호(· /)로 묶인 단어      →  "협업·대화" 끊김 방지
 * 긴 절이 줄폭을 넘으면 overflow-wrap(break-word)로 안전 처리.
 * 대상: 본문 단락·리스트. 제외: 코드/표/네비/링크.
 */
(function () {
  'use strict';

  var SKIP = 'code, pre, .highlight, .md-typeset__table, table, .nav-buttons, a, kbd, .arithmatex';
  var NBSP = ' ';
  var WJ = '⁠';

  var RESTORE = new RegExp('([.!?…,;:])' + NBSP, 'g');

  var CONNECTIVES = [
    '되어', '되며', '돼', '하여', '하며', '여서', '어서', '아서', '으며',
    '지만', '면서', '거나', '는데', '운데', '위해', '통해', '대해', '으로써', '로써'
  ];
  var CONNECTIVE = new RegExp('(' + CONNECTIVES.join('|') + ')' + NBSP, 'g');

  var GLUE_BRACKET = /([)\]”’」』])([가-힣])/g;          // ④ 닫는 괄호/따옴표 + 한글
  var GLUE_SEP = /([가-힣A-Za-z0-9])([·/])([가-힣A-Za-z0-9])/g; // ⑤ 병렬 기호

  function processBlock(block) {
    var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || node.nodeValue.indexOf(' ') === -1) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(function (node) {
      var orig = node.nodeValue;
      var out = orig
        .replace(/ /g, NBSP)
        .replace(RESTORE, '$1 ')
        .replace(CONNECTIVE, '$1 ')
        .replace(GLUE_BRACKET, '$1' + WJ + '$2')
        .replace(GLUE_SEP, '$1' + WJ + '$2' + WJ + '$3');
      if (out !== orig) node.nodeValue = out;
    });
  }

  function run() {
    document.querySelectorAll('.md-typeset p, .md-typeset li').forEach(function (el) {
      if (el.closest(SKIP)) return;
      processBlock(el);
    });
  }

  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();
