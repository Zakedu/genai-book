/**
 * Reading Progress Bar
 * 페이지 스크롤에 따른 읽기 진행률 표시
 */
document.addEventListener('DOMContentLoaded', function() {
  // Progress bar 요소 생성
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.prepend(progressBar);

  // 스크롤 이벤트 처리
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  // 스크롤 이벤트 리스너 (throttle 적용)
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  });

  // 초기 실행
  updateProgress();
});
