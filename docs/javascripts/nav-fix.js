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
});
