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

  let badge = document.getElementById('colorCountBadge');
  if (!badge) {
    badge = document.createElement('button');
    badge.id = 'colorCountBadge';
    badge.type = 'button';
    badge.className = 'color-count hidden';
    badge.setAttribute('aria-label', '로그인 상태 및 누적 컬러 수');
    authBtn.insertAdjacentElement('afterend', badge);
  }

  const getCount = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('daycolor-v1'));
      if (Array.isArray(saved?.records)) return saved.records.length;
    } catch {}
    return document.querySelectorAll('#recordList .record-card').length;
  };

  const updateCount = () => {
    badge.innerHTML = `누적컬러 <b>${getCount()}</b>개`;
  };

  const syncUi = () => {
    // 기존 앱의 Firebase 인증 콜백은 로그인 시 profile의 hidden을 제거하고 authBtn을 숨깁니다.
    const loggedIn = !profile.classList.contains('hidden') || authBtn.classList.contains('hidden');
    authBtn.classList.toggle('hidden', loggedIn);
    badge.classList.toggle('hidden', !loggedIn);
    updateCount();
  };

  // 인증 복원 타이밍과 관계없이 상태를 잡도록 초기 구간을 짧게 반복 확인합니다.
  let checks = 0;
  const timer = setInterval(() => {
    syncUi();
    checks += 1;
    if (checks >= 30) clearInterval(timer);
  }, 250);

  new MutationObserver(syncUi).observe(profile, {
    attributes: true,
    attributeFilter: ['class']
  });
  new MutationObserver(syncUi).observe(authBtn, {
    attributes: true,
    attributeFilter: ['class']
  });

  const recordList = document.getElementById('recordList');
  if (recordList) new MutationObserver(updateCount).observe(recordList, { childList: true, subtree: true });

  // 누적컬러 버튼을 누르면 기존 프로필 클릭 핸들러를 이용해 로그아웃할 수 있습니다.
  badge.addEventListener('click', () => profile.click());
  syncUi();
});
