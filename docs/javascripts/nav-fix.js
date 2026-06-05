// 네비게이션 버튼 링크 수정
document.addEventListener('DOMContentLoaded', function() {
  // nav-buttons 내의 링크들을 찾아서 수정
  const navButtons = document.querySelectorAll('.nav-buttons a');

  navButtons.forEach(function(link) {
    const href = link.getAttribute('href');

    // 현재 경로가 /part2/ch03-prompt-structure/ 형식일 때
    // href가 ch04-advanced-prompting/ 형식이면
    // ../ch04-advanced-prompting/ 로 변경해야 함

    if (href && !href.startsWith('/') && !href.startsWith('http') && !href.startsWith('../')) {
      // 상대 경로인 경우 ../ 추가
      link.setAttribute('href', '../' + href);
    }
  });

  // 각주(참고자료, .footnote)는 MkDocs가 글 맨끝에 렌더하므로 nav 버튼 아래로 감.
  // → 참고자료가 항상 nav 버튼 "위"에 오도록 순서 교정.
  const nav = document.querySelector('.md-content__inner .nav-buttons, .md-typeset .nav-buttons');
  const footnote = document.querySelector('.md-typeset .footnote');
  if (nav && footnote && nav.parentNode === footnote.parentNode) {
    const pos = nav.compareDocumentPosition(footnote);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
      nav.parentNode.insertBefore(footnote, nav); // footnote를 nav 앞으로
    }
  }

  // content tabs(=== "탭") → 클릭 없이 전부 펼치기 (학습 가독성).
  // 각 블록 위에 해당 라벨을 소제목으로 삽입한 뒤 모든 블록을 표시.
  document.querySelectorAll('.tabbed-set').forEach(function (set) {
    var labels = set.querySelectorAll(':scope > .tabbed-labels > label');
    var blocks = set.querySelectorAll(':scope > .tabbed-content > .tabbed-block');
    if (!labels.length || labels.length !== blocks.length) return;
    labels.forEach(function (label, i) {
      var block = blocks[i];
      if (!block || block.dataset.linearized) return;
      var title = document.createElement('p');
      title.className = 'tabbed-linear-title';
      title.textContent = label.textContent.trim();
      block.insertBefore(title, block.firstChild);
      block.dataset.linearized = '1';
    });
    set.classList.add('tabbed-linearized');
  });
});
