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

// Google 로그인 UI/상태 보강: 계정 선택창을 강제로 노출하고
// 로그인 후에는 프로필 대신 누적 컬러 수를 표시합니다.
document.addEventListener('DOMContentLoaded', async () => {
  const authBtn = document.getElementById('authBtn');
  const profile = document.getElementById('profile');
  const syncStatus = document.getElementById('syncStatus');
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
    badge.setAttribute('aria-label', 'Google 로그인 상태 및 누적 컬러 수');
    authBtn.insertAdjacentElement('afterend', badge);
  }

  const getCount = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('daycolor-v1'));
      return Array.isArray(saved?.records) ? saved.records.length : 0;
    } catch {
      return 0;
    }
  };

  const updateCount = () => {
    badge.innerHTML = `누적컬러 <b>${getCount()}</b>개`;
  };

  try {
    const [{ initializeApp, getApps, getApp }, { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut }]
      = await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js')
      ]);

    const app = getApps().length ? getApp() : initializeApp(window.DAYCOLOR_FIREBASE_CONFIG);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    onAuthStateChanged(auth, user => {
      if (user) {
        authBtn.classList.add('hidden');
        badge.classList.remove('hidden');
        updateCount();
        if (syncStatus) syncStatus.textContent = `Google 로그인됨 · ${user.email || ''}`;
      } else {
        authBtn.classList.remove('hidden');
        badge.classList.add('hidden');
        if (syncStatus) syncStatus.textContent = 'Google로 동기화하면 여러 기기에서 같은 기록을 볼 수 있습니다. 로그인 전에는 이 브라우저에 저장됩니다.';
      }
    });

    // 기존 onclick보다 먼저 가로채서 계정 선택창이 반드시 뜨는 로그인으로 실행합니다.
    authBtn.addEventListener('click', async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error('Google login failed', error);
        const code = error?.code || 'unknown-error';
        if (syncStatus) syncStatus.textContent = `Google 로그인 실패 · ${code}`;
        alert(`Google 로그인에 실패했습니다.\n${code}`);
      }
    }, true);

    badge.addEventListener('click', async () => {
      if (confirm('Google 계정 동기화를 종료할까요?')) await signOut(auth);
    });
  } catch (error) {
    console.error('Firebase auth bootstrap failed', error);
    if (syncStatus) syncStatus.textContent = 'Google 로그인 모듈을 불러오지 못했습니다.';
  }

  const recordList = document.getElementById('recordList');
  if (recordList) new MutationObserver(updateCount).observe(recordList, { childList: true, subtree: true });
});
