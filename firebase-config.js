// DayColor Firebase web app configuration
window.DAYCOLOR_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBussL64qEf-3yV1HeUUhibrXQH1z-tPKI",
  authDomain: "daycolor-44bb0.firebaseapp.com",
  projectId: "daycolor-44bb0",
  storageBucket: "daycolor-44bb0.firebasestorage.app",
  messagingSenderId: "444468112714",
  appId: "1:444468112714:web:fd0c293f7e9ae0929a65b3",
  measurementId: "G-PSKNKW6GJ0"
};

// 로그인 후 프로필 사진 대신 누적 컬러 수를 표시합니다.
document.addEventListener('DOMContentLoaded', () => {
  const authBtn = document.getElementById('authBtn');
  const profile = document.getElementById('profile');
  const recordList = document.getElementById('recordList');
  if (!authBtn || !profile) return;

  const style = document.createElement('style');
  style.textContent = `
    #profile{display:none!important}
    .color-count{
      border:0;
      border-radius:18px;
      background:#eef8f6;
      color:#2F9C95;
      padding:8px 12px;
      font-size:13px;
      font-weight:750;
      white-space:nowrap;
    }
    .color-count b{font-size:15px;font-weight:850}
  `;
  document.head.appendChild(style);

  const badge = document.createElement('button');
  badge.type = 'button';
  badge.className = 'color-count hidden';
  badge.setAttribute('aria-label', 'Google 로그인 상태 및 누적 컬러 수');
  authBtn.insertAdjacentElement('afterend', badge);

  let loggedIn = false;

  const updateCount = () => {
    const count = document.querySelectorAll('#recordList .record-card').length;
    badge.innerHTML = `누적컬러 <b>${count}</b>개`;
  };

  const updateAuthUi = () => {
    authBtn.classList.toggle('hidden', loggedIn);
    badge.classList.toggle('hidden', !loggedIn);
    updateCount();
  };

  new MutationObserver(() => {
    // 앱의 인증 콜백이 profile의 hidden 클래스를 제거하면 로그인으로 판단합니다.
    if (!profile.classList.contains('hidden')) {
      loggedIn = true;
      updateAuthUi();
    } else if (!authBtn.classList.contains('hidden')) {
      loggedIn = false;
      updateAuthUi();
    }
  }).observe(profile, { attributes: true, attributeFilter: ['class'] });

  if (recordList) {
    new MutationObserver(updateCount).observe(recordList, { childList: true, subtree: true });
  }

  badge.addEventListener('click', () => profile.click());
  updateCount();
});
