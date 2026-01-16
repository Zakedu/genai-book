/**
 * GenAI Book 챗봇 위젯
 * MkDocs Material 테마와 통합
 */

(function() {
  'use strict';

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8001'
    : `http://${window.location.hostname}:8001`;
  const STORAGE_KEY = 'genai_chatbot_history';

  // 상태 관리
  let isOpen = false;
  let isLoading = false;
  let messages = [];
  let chatHistory = [];

  // DOM 요소
  let widget, toggleBtn, chatContainer, messagesContainer, inputForm, inputField;

  /**
   * 위젯 초기화
   */
  function init() {
    createWidget();
    loadHistory();
    bindEvents();
  }

  /**
   * 위젯 HTML 생성
   */
  function createWidget() {
    // 위젯 컨테이너
    widget = document.createElement('div');
    widget.id = 'genai-chatbot';
    widget.className = 'genai-chatbot';
    widget.innerHTML = `
      <button class="chatbot-toggle" aria-label="챗봇 열기">
        <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="chatbot-container">
        <div class="chatbot-header">
          <div class="chatbot-title">
            <span class="chatbot-icon">AI</span>
            <span>인공지능 챗봇</span>
          </div>
          <button class="chatbot-clear" title="대화 초기화">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>

        <div class="chatbot-messages">
          <div class="chatbot-welcome">
            <p>안녕하세요! <strong>생성형 AI 완전 정복</strong> 인공지능 챗봇입니다.</p>
            <p>교재 내용에 대해 궁금한 점을 물어보세요.</p>
            <div class="chatbot-suggestions">
              <button class="suggestion-btn">프롬프트란 무엇인가요?</button>
              <button class="suggestion-btn">환각이 뭔가요?</button>
              <button class="suggestion-btn">LLM의 작동 원리</button>
            </div>
          </div>
        </div>

        <form class="chatbot-input-form">
          <input
            type="text"
            class="chatbot-input"
            placeholder="질문을 입력하세요..."
            autocomplete="off"
          />
          <button type="submit" class="chatbot-send" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(widget);

    // DOM 참조 저장
    toggleBtn = widget.querySelector('.chatbot-toggle');
    chatContainer = widget.querySelector('.chatbot-container');
    messagesContainer = widget.querySelector('.chatbot-messages');
    inputForm = widget.querySelector('.chatbot-input-form');
    inputField = widget.querySelector('.chatbot-input');
  }

  /**
   * 이벤트 바인딩
   */
  function bindEvents() {
    // 토글 버튼
    toggleBtn.addEventListener('click', toggleChat);

    // 입력 폼
    inputForm.addEventListener('submit', handleSubmit);

    // 입력 필드 변경
    inputField.addEventListener('input', () => {
      const sendBtn = widget.querySelector('.chatbot-send');
      sendBtn.disabled = !inputField.value.trim();
    });

    // 대화 초기화
    widget.querySelector('.chatbot-clear').addEventListener('click', clearHistory);

    // 추천 질문
    widget.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        inputField.value = btn.textContent;
        inputField.dispatchEvent(new Event('input'));
        handleSubmit(new Event('submit'));
      });
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat();
      }
    });
  }

  /**
   * 챗봇 토글
   */
  function toggleChat() {
    isOpen = !isOpen;
    widget.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-label', isOpen ? '챗봇 닫기' : '챗봇 열기');

    if (isOpen) {
      inputField.focus();
    }
  }

  /**
   * 메시지 전송 처리
   */
  async function handleSubmit(e) {
    e.preventDefault();

    const message = inputField.value.trim();
    if (!message || isLoading) return;

    // 입력 초기화
    inputField.value = '';
    widget.querySelector('.chatbot-send').disabled = true;

    // 웰컴 메시지 숨기기
    const welcome = widget.querySelector('.chatbot-welcome');
    if (welcome) {
      welcome.style.display = 'none';
    }

    // 사용자 메시지 추가
    addMessage('user', message);

    // 로딩 표시
    isLoading = true;
    const loadingEl = addMessage('assistant', '', true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: chatHistory
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || '서버 오류가 발생했습니다');
      }

      const data = await response.json();

      // 로딩 제거 후 응답 표시
      loadingEl.remove();
      addMessage('assistant', data.response, false, data.sources);

      // 히스토리 업데이트
      chatHistory.push({ role: 'user', content: message });
      chatHistory.push({ role: 'assistant', content: data.response });
      saveHistory();

    } catch (error) {
      loadingEl.remove();
      addMessage('error', error.message || '연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      isLoading = false;
    }
  }

  /**
   * 메시지 추가
   */
  function addMessage(role, content, isLoading = false, sources = []) {
    const messageEl = document.createElement('div');
    messageEl.className = `chatbot-message ${role}`;

    if (isLoading) {
      messageEl.innerHTML = `
        <div class="message-content">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
    } else if (role === 'error') {
      messageEl.innerHTML = `
        <div class="message-content error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>${escapeHtml(content)}</span>
        </div>
      `;
    } else {
      let sourcesHtml = '';
      if (sources && sources.length > 0) {
        // 사이트 base URL 가져오기
        const baseUrl = document.querySelector('link[rel="canonical"]')?.href?.replace(/[^/]*$/, '')
                     || window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
        sourcesHtml = `
          <div class="message-sources">
            <span class="sources-label">참고:</span>
            ${sources.map(s => `
              <a href="${baseUrl}${s.url}" class="source-link">${s.chapter || s.title}</a>
            `).join('')}
          </div>
        `;
      }

      messageEl.innerHTML = `
        <div class="message-content">
          ${role === 'assistant' ? '<div class="message-icon">AI</div>' : ''}
          <div class="message-text">${formatMessage(content)}</div>
        </div>
        ${sourcesHtml}
      `;
    }

    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return messageEl;
  }

  /**
   * 메시지 포맷팅 (마크다운 간단 변환)
   */
  function formatMessage(text) {
    return escapeHtml(text)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  /**
   * HTML 이스케이프
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 히스토리 저장
   */
  function saveHistory() {
    try {
      // 최근 20개 메시지만 저장
      const toSave = chatHistory.slice(-20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  }

  /**
   * 히스토리 로드
   */
  function loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        chatHistory = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
      chatHistory = [];
    }
  }

  /**
   * 히스토리 초기화
   */
  function clearHistory() {
    chatHistory = [];
    localStorage.removeItem(STORAGE_KEY);

    // 메시지 초기화
    messagesContainer.innerHTML = `
      <div class="chatbot-welcome">
        <p>안녕하세요! <strong>생성형 AI 완전 정복</strong> 인공지능 챗봇입니다.</p>
        <p>교재 내용에 대해 궁금한 점을 물어보세요.</p>
        <div class="chatbot-suggestions">
          <button class="suggestion-btn">프롬프트란 무엇인가요?</button>
          <button class="suggestion-btn">환각이 뭔가요?</button>
          <button class="suggestion-btn">LLM의 작동 원리</button>
        </div>
      </div>
    `;

    // 추천 질문 이벤트 재바인딩
    widget.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        inputField.value = btn.textContent;
        inputField.dispatchEvent(new Event('input'));
        handleSubmit(new Event('submit'));
      });
    });
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
